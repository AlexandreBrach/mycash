from django.db import IntegrityError

from comptes.models import Encours
from comptes.services.extraits import AlreadyExists


class EncoursService:

    @staticmethod
    def assemble(qs):
        return list(
            map(
                lambda x: {
                    "categoryId": str(x.categorie_id),
                    "amount": x.amount,
                    "date": x.due_date,
                    "closed": x.closed
                },
                qs,
            )
        )

    @staticmethod
    def create(date, amount, categorie):
        '''
        insert encours in database
        :param date: date.datetime
        :param amount: integer
        :param categorie: integer
        :return:
        '''
        e = Encours(amount=amount, categorie_id=categorie, due_date=date)

        try:
            e.save()
        except IntegrityError:
            raise AlreadyExists()

    def get(self):
        qs = Encours.objects.all()
        return self.assemble(qs)

    def get_from_month(self, date):
        """return the month encours

        Args:
            date (date.datetime): date
        """
        qs = Encours.objects.filter(due_date__year=date.year, due_date__month=date.month)
        return self.assemble(qs)


def regroup_by_category(encours):
    """
    find all doublons of category in encours and make them unique with cumul their amount
    :param encours:
    :return:
    """
    group = {}
    for e in encours:
        if not e['categoryId'] in group:
            group[e['categoryId']] = 0

        group[e['categoryId']] += e['amount']
    unique = list({v['categoryId']: v for v in encours}.values())

    for u in unique:
        u['amount'] = group[u['categoryId']]

    return unique


def add_echeances(dest, source):
    """
    add the e2 echeances to e1. If the date and category matches, make this unique with amount sum

    :param dest:
    :param source:
    :return:
    """

    def add_echeance(dest, source):

        match = (i for i, val in enumerate(dest) if
                 val["date"] == source["date"] and val["categoryId"] == source["categoryId"])

        try:
            i = next(match)
            dest[i]["amount"] += source["amount"]

        except StopIteration:
            dest.append({
                "date": source["date"],
                "categoryId": source["categoryId"],
                "amount": source["amount"]
            })

        return dest

    for s in source:
        dest = add_echeance(dest, s)

    return dest
