import datetime

from comptes.services.extraits import ExtraitsService
from comptes.models import MonthSummary, Prev
from django.db import connection
from comptes.services.encours import EncoursService, regroup_by_category
from comptes.services.prevision import generate_encours


def create_unarchived_month_summary():
    cursor = connection.cursor()
    # renvoie tous les couples mois/an trouvés dans les extraits
    # qu'on ne trouve pas dans monthsummary
    query = """select t1.month as month, t1.year as year from (
        select distinct extract(MONTH FROM date) as month, extract(YEAR FROM date) as year 
            from comptes_extrait
        ) t1 
        left JOIN (
        select distinct extract(MONTH FROM date) as month, extract(YEAR FROM date) as year 
            from comptes_monthsummary 
        ) t2
        on t1.month=t2.month and t1.year=t2.year
        where t2.month is null and t2.year is null"""

    cursor.execute(query)
    records = cursor.fetchall()

    for r in records:
        create_month_summary(int(r[0]), int(r[1]))


def create_month_summary(month, year):
    """create a new entry in month summary
    and also related encours

    Args:
        month (integer): month
        year (integer): year
    """
    extrait_service = ExtraitsService()
    start_solde = extrait_service.get_start_solde(month, year)
    bilan = extrait_service.get_month_bilan(month, year)

    MonthSummary.objects.create(
        date=datetime.datetime(year, month, 1),
        startSolde=start_solde,
        bilan=bilan,
    )
    generate_encours(month, year)


def get_month_summary(year, month):
    """
    return the matching line in database

    :param year:
    :param month:
    :return MomthSummary:
    """
    s = MonthSummary.objects.filter(
        date__year=year,
        date__month=month
    )
    if len(s) == 0:
        return None

    return s[0]


def update_month_summary():
    """update all the month_summary unarchived records"""
    qs = MonthSummary.objects.filter(archived=False)
    for month in qs:
        month.bilan = compute_bilan(month.date)
        month.save()


def compute_bilan(date):
    """compute the bilan for the given month

    Args:
        date (date.datetime): date
    """
    extrait_service = ExtraitsService()
    encours_service = EncoursService()
    extraits = extrait_service.filter_extraits({"month": "{0}-{1}".format(date.year, date.month)})
    # sum of every month operations
    bilan = extrait_service.get_month_bilan(date.month, date.year)
    # find encours of the month
    encours = encours_service.get_from_month(date)
    # regrouper les encours et les facts par categories !
    encours = regroup_by_category(encours)

    for e in encours:
        # bilan provisoire
        p = 0
        if not e["closed"]:
            # p = prevision mensuelle lié à la catégorie d'encours
            prev = Prev.objects.filter(
                categorie_id=e["categoryId"],
                due_date=e["date"]
            )
            if (len(prev) != 0):
                p = sum(l.amount for l in prev)

        # f : ce qui a été payé durant le mois sur cette catégorie
        lines = filter(lambda line: line["categorie"] == e["categoryId"], extraits)
        f = sum([l["amount"] for l in lines])
        bilan += p - max([abs(e["amount"]), abs(f)])

    return bilan
