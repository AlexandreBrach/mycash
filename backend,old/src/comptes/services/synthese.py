from comptes.models import Categorie, Extrait, Synthese
from django.db import IntegrityError, connection


class SyntheseService:
    def __init__(self):
        pass

    @staticmethod
    def update_synthese():
        """ refresh the materialized view comptes_synthese
        """
        query = "REFRESH MATERIALIZED VIEW comptes_synthese"
        with connection.cursor() as cursor:
            cursor.execute(query)

    @staticmethod
    def group_by_month(raw):
        """group the raw synthese data by month
        """
        temp = {}
        all_name = set()
        for r in raw:
            if r['month_year'] not in temp:
                temp[r['month_year']] = {}
            temp[r['month_year']][r['categorie_id']] = r['amount']
            all_name.add(r['categorie_id'])

        # convert the set to a dict with month as keys
        all_name = dict.fromkeys(all_name, 0)

        # Assemble the response
        response = {}
        for k, r in temp.items():
            item = {'month_year': k}
            # add unassigned month (the order is important !)
            response[k] = {**all_name, **r}

        return response

    @staticmethod
    def group_by_category(raw):
        """ category grouping, with every unassigned month set to 0
        """
        temp = {}
        all_month_year = set()
        for r in raw:
            if r['name'] not in temp:
                temp[r['name']] = {}
            temp[r['name']][r['month_year']] = r['amount']
            all_month_year.add(r['month_year'])

        # convert the set to a dict with month as keys
        all_month_year = dict.fromkeys(all_month_year, 0)

        # Assemble the response
        response = {}
        for k, r in temp.items():
            item = {'name': k}
            # add unassigned month (the order is important !)
            response[k] = {**all_month_year, **r}

        return response

    def get_synthese_category(self):
        """ return all month with amount for every categories
        :return:
        """
        qs = Synthese.objects.all()
        raw = []

        for line in qs:
            raw.append(line.assemble())

        return self.group_by_month(raw)

    @staticmethod
    def get_synthese_month():
        """Return all distinct month values from extraits
        """

        qs = Extrait.objects.values('date__month',
                                    'date__year').distinct().order_by(
            '-date__year', '-date__month')
        response = []
        for line in qs:
            response.append('{}-{}'.format(line['date__year'],
                                           line['date__month']))
        return response
