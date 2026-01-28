import datetime
import logging

from dateutil.relativedelta import relativedelta

from comptes.exceptions import DuplicatedEntry
from comptes.models import PrevisionRules, Categorie, Echeance, Prev, MonthSummary
from django.db import IntegrityError
from comptes.services.encours import EncoursService, regroup_by_category, add_echeances

from django.db.models import Q


def get_rules():
    """
    return all prevision Rules
    """
    qs = PrevisionRules.objects.select_related("categorie")
    response = []
    for rules in qs:
        categorie = rules.categorie
        response.append(
            {
                "id": rules.id,
                "categoryId": str(categorie.id),
                "categoryName": categorie.name,
                "period": rules.period,
                "amount": rules.amount,
                "start": rules.start,
                "end": rules.end,
            }
        )
    return response


def set_rule(rule):
    """
    insert a new rule in database

    :param rule:
    :return:
    """
    if "end" in rule:
        end = rule["end"]
    else:
        end = None

    category = Categorie.objects.filter(id=rule["categoryId"])
    if rule["id"] == 0:
        obj = PrevisionRules.objects.create(
            amount=rule["amount"],
            categorie=category[0],
            period=rule["period"],
            start=rule["start"],
            end=end,
        )
    else:
        obj = PrevisionRules.objects.get(id=rule["id"])
        obj.amount = rule["amount"]
        obj.categorie = category[0]
        obj.period = rule["period"]
        obj.start = rule["start"]
        obj.end = end
    try:
        obj.save()
    except IntegrityError:
        raise DuplicatedEntry("Category already exists")

    compute_previsions()


def delete_rule(id):
    """
    remove id-based rule
    :param id:
    """
    PrevisionRules.objects.filter(id=id).delete()
    compute_previsions()


def get_month_previsions(month_date):
    """Return the previsions from rule that will occurs
    at the givent date

    Args:
        month_date (date): month
    Returns:
        record
    """

    def is_targeting(rule):
        """Return true if month_date is targetted by rule

        :param rule:
        :return:
        """
        d_month = (
                (month_date.year - rule.start.year) * 12
                + month_date.month
                - rule.start.month
        )
        # month is before rule start
        if d_month < 0:
            return False
        return d_month % rule.period == 0

    # renvoyer les rules où la date est dans l'intervalle
    qs = PrevisionRules.objects.filter(start__lte=month_date).filter(
        Q(end__gte=month_date) | Q(end__isnull=True)
    )

    # filtrer les règles qui ne matche pas
    matching_rules = []
    for ar in qs:
        if is_targeting(ar):
            matching_rules.append(ar)

    # transformer les rules en échéances
    return list(
        map(
            lambda r: {
                "categoryId": r.categorie_id,
                "amount": r.amount,
                "date": month_date,
            },
            matching_rules,
        )
    )


def remove_echeancer(collection_id):
    """
    Remove echeancier based on its id

    :param collection_id:
    :return:
    """
    Echeance.objects.filter(collection=collection_id).delete()


def update_echeancier(self, collection_id, echeances):
    """
    update echeances
    """
    if collection_id != "":
        self.remove_echeancer(collection_id)
    if collection_id == "":
        collection_id = datetime.datetime.now().timestamp()
    echeance_models = list(
        map(
            lambda e: Echeance(
                amount=e["montant"],
                categorie_id=e["categoryId"],
                collection=collection_id,
                due_date=datetime.date(
                    int(e["date"].split("-")[0]), int(e["date"].split("-")[1]), 15
                ),
            ),
            echeances,
        ),
    )
    Echeance.objects.bulk_create(echeance_models)


def get_echeancier(collection):
    """
    return echeancier based on its id
    :param collection:
    :return:
    """
    qs = Echeance.objects.filter(collection=collection)
    echeances = []
    for line in qs:
        echeances.append(
            {
                "date": "{0}-{1}".format(line.due_date.year, line.due_date.month),
                "amount": line.amount,
                "categoryId": str(line.categorie.id),
            }
        )
    return {
        "collection": collection,
        "echeancier": echeances,
    }


def get_echeanciers_id():
    """
    return all echeanciers id
    :return:
    """
    qs = Echeance.objects.values("collection", "categorie_id").distinct()
    response = []
    for line in qs:
        response.append(
            {"id": line["collection"], "category": line["categorie_id"]}
        )
    return response


def get_echeances_between(start, end):
    """return echeances from all echeancier between two dates

    Args:
        start (date): start month
        end (date): end month

    Returns:
        Dict: records
    """
    qs = Echeance.objects.filter(due_date__gte=start, due_date__lte=end)
    echeances = []
    for line in qs:
        echeances.append(
            {
                "date": line.due_date,
                "amount": line.amount,
                "categoryId": str(line.categorie.id),
            }
        )
    return echeances


def generate_encours(month, year):
    """generate encours based on the previsions table and echeanciers

    Args:
        month (integer): month
        year (integer): year
    """

    encours_service = EncoursService()

    start = datetime.datetime(year, month, 1)
    end = datetime.datetime(year, month, 28)
    # from echeanciers
    echeances = get_echeances_between(start, end)
    for e in echeances:
        encours_service.create(e["date"], e["montant"], e["categoryId"])

    # from previsionsrules
    echeances = get_month_previsions(start)

    for e in echeances:
        encours_service.create(e["date"], e["amount"], e["categoryId"])


def date_where_rule_apply(rule: PrevisionRules, start, end):
    """
    Return the date when rule apply between two date

    :param PrevisionRules rule:
    :param datetime.date start:
    :param datetime.date end:
    :return list of datetime.date:
    """

    def month_numbers(d):
        """
        return the date total number of month
        :param datetime.date d:
        :return int:
        """
        return d.year * 12 + d.month

    if rule.end is None:
        ruleEnd = datetime.date(2100, 1, 1)
    else:
        ruleEnd = rule.end

    if rule.start > start:
        start = rule.start

    diff = month_numbers(start) - month_numbers(rule.start)
    if diff >= 0:
        months = diff
    else:
        months = diff + 12

    modulo = months % rule.period
    next_date = start
    if modulo != 0:
        next_date = next_date + relativedelta(months=rule.period - modulo)

    result = []
    while (next_date < end) and (next_date <= ruleEnd):
        result.append(next_date)
        next_date = next_date + relativedelta(months=rule.period)

    return result


def rules_to_echeances(rules, start, length):
    """
    convert previsions rules to list of echeances

    :param PrevisionRules rules:
    :param datetime.date start:
    :param int length:
    :return:
    """
    end = start + relativedelta(months=+length)
    response = []
    response += [{
        "date": m,
        "categoryId": rules.categorie_id,
        "amount": rules.amount
    } for m in date_where_rule_apply(rules, start, end)]
    return response


def flush_previsions_month():
    """
    remove all record in the prev table
    :param datetime.date date:
    :return:
    """

    Prev.objects.all().delete()


def compute_previsions():
    """
    calculate all previsions and write them in the table
    """

    # number of month of the previsions table
    MONTH_NUMBER = 120

    # delete all record
    flush_previsions_month()

    oldest_date = MonthSummary.objects.oldest_unarchived()

    if len(oldest_date) == 0:
        # will do nothing
        return

    oldest_date = oldest_date[0].date

    # all rules
    qs = PrevisionRules.objects.all()
    for r in qs:
        echeances = rules_to_echeances(r, oldest_date, MONTH_NUMBER)

        for e in echeances:
            p = Prev.objects.create(
                due_date=e["date"],
                categorie_id=e["categoryId"],
                amount=e["amount"]
            )
            p.save()


def get_monthly_previsions():
    qs = Prev.objects.all()
    echeances_previsions = [{'date': p.due_date, 'categoryId': str(p.categorie_id), "amount": p.amount} for p in qs]

    qs2 = Echeance.objects.all()
    echeances = [{'date': p.due_date, 'categoryId': str(p.categorie_id), "amount": p.amount} for p in qs2]

    result = add_echeances(echeances_previsions, echeances)
    return result
