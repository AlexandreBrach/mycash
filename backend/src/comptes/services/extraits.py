import datetime

# import the logging library
import logging
import codecs

import django.dispatch
import pytz

from comptes.models import Categorie, Extrait
from comptes.services.state import StateService

from django.db import IntegrityError, connection

extrait_updated = django.dispatch.Signal()


class AlreadyExists(Exception):
    pass


class ExtraitsService:

    def __init__(self):
        self.state_service = StateService()

    def get_extraits(self):

        qs = Extrait.objects.select_related("categorie").order_by("-date")
        response = []
        for line in qs:
            categorie = line.categorie
            if categorie == None:
                categorie_id = 0
                categorie_name = ""
            else:
                categorie_id = categorie.id
                categorie_name = categorie.name
            response.append(
                {
                    "id": line.id,
                    "date_operation": line.date,
                    "label": line.label,
                    "montant": line.montant,
                    "categorie": categorie_id,
                    "categorie_name": categorie_name,
                    "categorie_month": line.categorie_month,
                }
            )
        return response

    def filter_extraits(self, criteria):

        qs = (
            Extrait.objects.main_filter(criteria)
            .select_related("categorie")
            .order_by("-date")
        )

        response = []
        for line in qs:
            categorie = line.categorie
            if categorie == None:
                categorie_id = 0
                categorie_name = ""
            else:
                categorie_id = categorie.id
                categorie_name = categorie.name
            response.append(
                {
                    "id": line.id,
                    "date_operation": line.date,
                    "label": line.label,
                    "montant": line.montant,
                    "categorie": categorie_id,
                    "categorie_name": categorie_name,
                    "categorie_month": line.categorie_month,
                    "note": line.note,
                }
            )

        # Add daterefs from other month
        other = []
        if "month" in criteria:
            criteria["categorie_month"] = "{0}-01".format(criteria["month"])
            del criteria["month"]
            other = self.filter_extraits(criteria)

        response = response + other

        # make unique (daterefs = current month)
        seen = []
        unique = []
        for d in response:
            if not (d["id"] in seen):
                unique.append(d)
                seen.append(d["id"])

        return unique

    def get_month_bilan(self, month, year):
        extraits = self.filter_extraits({"month": "{0}-{1}".format(year, month)})
        return sum([e["montant"] for e in extraits])

    def set_category(self, ids, id_category):
        """update the given category"""

        if id_category == 0:
            Extrait.objects.filter(pk__in=ids).update(categorie=None)
        else:
            category = Categorie.objects.get(id=id_category)
            Extrait.objects.filter(pk__in=ids).update(categorie=category)
        self.send_extrait_updated_signal()

    def add_extrait_line(self, date_operation, label, montant):
        """
        Add a line in the extrais stack
        the solde is recalculated
        """
        date_operation = datetime.datetime.strptime(date_operation, "%Y-%m-%d")
        aware_date_operation = pytz.utc.localize(date_operation)
        montant = float(montant)

        extrait_line = Extrait(
            date=date_operation, montant=montant, label=label.strip()
        )
        try:
            extrait_line.save()
        except IntegrityError:
            raise AlreadyExists()

        new_solde = self.state_service.compute_solde(montant)
        extrait_line.solde = new_solde
        extrait_line.save()

    def set_refdate(self, ids, date):
        """
        update the ref date of the id-based extrait line
        """
        if date == "":
            Extrait.objects.filter(pk__in=ids).update(categorie_month=None)
        else:
            Extrait.objects.filter(pk__in=ids).update(categorie_month=date)
        self.send_extrait_updated_signal()

    def send_extrait_updated_signal(self):
        extrait_updated.send(sender=self.__class__)

    def get_last_insertion_date(self):

        query = 'SELECT max("date_insertion") as date_insertion FROM "comptes_extrait"'
        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchone()
        return result[0]

    def _date_truncate_seconds(self, date):
        """
        set seconds and milliseconds to 0 in the passed date
        """
        return date.replace(second=0, microsecond=0)

    def count_lines_by_insertion_time(self, date):

        date = self._date_truncate_seconds(date)
        query = 'SELECT count(*) as co FROM "comptes_extrait" WHERE date_insertion > %s'
        with connection.cursor() as cursor:
            cursor.execute(query, [date.isoformat()])
            result = cursor.fetchone()
        return result[0]

    def delete_by_insertion_date(self, date):

        date = self._date_truncate_seconds(date)
        query = 'DELETE FROM "comptes_extrait" WHERE date_insertion > %s'
        with connection.cursor() as cursor:
            cursor.execute(query, [date.isoformat()])

    def upload(self, uploaded_file):

        logger = logging.getLogger("insertor")

        sourceFile = codecs.EncodedFile(
            uploaded_file, data_encoding="utf-8", file_encoding="latin-1"
        )

        lines = list(map(lambda a: a.decode(), sourceFile.readlines()))

        for l in lines[1:]:
            record = l.split(";")
            dateParts = record[0].split("/")
            date = "{0}-{1}-{2}".format(dateParts[2], dateParts[1], dateParts[0])
            label = record[2]
            montant = (
                "{0}{1}".format(record[8], record[9]).replace(",", ".").replace("+", "")
            )

            logger.info("Insertion : {0} - {1}".format(label, montant))
            try:
                self.add_extrait_line(date, label, montant)
            except AlreadyExists:
                logger.info("Duplicate key, will not be inserted")
                pass
        self.send_extrait_updated_signal()

    def set_note(self, id, note):
        Extrait.objects.filter(pk__in=[id]).update(note=note)

    def get_start_solde(self, month, year):
        """return the sold at the begining of the month
        Args:
            month (number): month
            year (number): year
        """

        query = """select solde from comptes_extrait where date=(
            SELECT min(date) FROM comptes_extrait
            where extract(MONTH FROM date) = %s
            and extract(YEAR FROM date) = %s
        ) order by id desc"""
        cursor = connection.cursor()
        cursor.execute(query, [month, year])
        records = cursor.fetchone()

        return records[0]
