import datetime
import json
import re

import dateutil.parser

from comptes.services.category import CategoryService
from comptes.services.extraits import AlreadyExists, ExtraitsService
from comptes.services.prevision import get_rules, set_rule, delete_rule, update_echeancier, remove_echeancer, \
    get_echeancier, get_echeanciers_id, get_echeances_between, get_monthly_previsions
from comptes.services.synthese import SyntheseService
from comptes.services.encours import EncoursService
from comptes.services.state import StateService
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.template import loader
from django.views.decorators.http import require_POST
from django.core.exceptions import BadRequest


class MainView:
    def __init__(self):
        self.extrait_service = ExtraitsService()
        self.synthese_service = SyntheseService()
        self.category_service = CategoryService()
        self.encours_service = EncoursService()
        self.state_service = StateService()

    def index(self, request):
        """
        kind of http probe
        :param request:
        :return:
        """
        return HttpResponse("Hello, world.")

    def get_extraits(self, request):
        response = self.extrait_service.get_extraits()
        return JsonResponse(response, safe=False)

    def filter_extraits(self, request):
        criteria = json.loads(request.body)
        response = self.extrait_service.filter_extraits(criteria)
        return JsonResponse(response, safe=False)

    def get_months(self, request):
        response = self.synthese_service.get_synthese_month()
        return JsonResponse(response, safe=False)

    def get_categories(self, request):
        """
        return categories
        """
        response = self.category_service.get_categories()
        return JsonResponse(response, safe=False)

    def add_extrait_line(self, request, date_operation, label, montant):
        self.extrait_service.add_extrait_line(date_operation, label, montant)
        return HttpResponse(
            'Extrait line : label="{}" montant={} date={}'.format(
                label, montant, date_operation
            )
        )

    def set_category(self, request, id_category):
        payload = json.loads(request.body)
        ids = payload["ids"]
        self.extrait_service.set_category(ids, id_category)
        return JsonResponse({"response": "done"})

    def add_category(self, request, name):
        try:
            self.category_service.add_category(name)
        except AlreadyExists:
            return JsonResponse({"response": "already exists"})

        return JsonResponse({"response": "done"})

    def get_categories_tree(self, request):
        """provide the entire tree of categories"""
        template = loader.get_template("comptes/category_tree.html")
        context = {}
        response = template.render(context, request)
        pattern = re.compile("\\,\\s*\\}")
        response = re.sub(pattern, "}", response)
        return HttpResponse(response)

    def set_refdate(self, request):
        payload = json.loads(request.body)
        ids = payload["ids"]
        date_part = payload["date"].split("-")
        year = int(date_part[0])
        month = int(date_part[1])
        date = datetime.datetime(year, month, 1)
        self.extrait_service.set_refdate(ids, date)
        return JsonResponse({"response": date})

    def move_category(self, request, id_category, id_target):
        self.category_service.move(id_category, id_target)
        return JsonResponse({"result": "done"})

    def rename_category(self, request, id, new_name):
        self.category_service.rename(id, new_name)
        return JsonResponse({"result": "done"})

    def delete_category(self, request, id):
        self.category_service.delete(id)
        return JsonResponse({"result": "done"})

    def synthese_category(self, request):
        response = self.synthese_service.get_synthese_category()
        return JsonResponse(response, safe=False)

    def last_insertion_date(self, request):
        date = self.extrait_service.get_last_insertion_date()
        count = self.extrait_service.count_lines_by_insertion_time(date)
        return JsonResponse({"date": date, "records": count})

    def delete_last_insertion_date(self, request):
        insertion_date = self.extrait_service.get_last_insertion_date()
        self.extrait_service.delete_by_insertion_date(insertion_date)

    def upload_extraits(self, request):

        # @TODO : checker le content_type
        file = request.FILES["fileUpload"]

        self.extrait_service.upload(file)

        return JsonResponse({"result": "done"})

    def add_note(self, request, id):

        incoming_data = json.loads(request.body)
        if "note" not in incoming_data:
            raise BadRequest('Missing needed "note" parameter')

        note = incoming_data["note"]
        self.extrait_service.set_note(id, note)
        return JsonResponse({"result": "done"})

    def previsions_rules(self, request):

        rules = get_rules()
        return JsonResponse({"response": rules})

    def previsions_rule(self, request):

        payload = json.loads(request.body)
        set_rule(payload["rule"])
        return JsonResponse({"result": "done"})

    def previsions_rule_delete(self, request, id):
        delete_rule(id)
        return JsonResponse({"result": "done"})

    def update_category_color(self, request, id, color):
        self.category_service.update_color(id, color)
        return JsonResponse({"result": "done"})

    def get_solde(self, request):
        if request.method == "GET":
            solde = self.state_service.get_solde()
            return JsonResponse({"response": solde})
        if request.method == "POST":
            payload = json.loads(request.body)
            if "value" not in payload:
                raise BadRequest('Missing needed "value" parameter')

            solde = payload["value"]
            self.state_service.update_solde(solde)
            return JsonResponse({"result": "done"})

    def create_previsions_echeancier(self, request):
        if request.method == "GET":
            raise BadRequest("Http Method Not implemented")
        if request.method == "POST":
            payload = json.loads(request.body)
            if "echeancier" not in payload:
                raise BadRequest('Missing needed "echeancier" parameter')
            update_echeancier(
                "",
                payload["echeancier"],
            )
            return JsonResponse({"result": "done"})

    def previsions_echeancier_delete(self, request, id):
        remove_echeancer(id)
        return JsonResponse({"result": "done"})

    def previsions_echeancier(self, request, id):
        if request.method == "GET":
            result = get_echeancier(id)
            return JsonResponse({"result": result})
        if request.method == "POST":
            payload = json.loads(request.body)
            if "echeancier" not in payload:
                raise BadRequest('Missing needed "echeancier" parameter')
            update_echeancier(
                id,
                payload["echeancier"],
            )
            return JsonResponse({"result": "done"})

        raise BadRequest("Http Method Not implemented")

    def previsions_echeanciers(self, request):
        result = get_echeanciers_id()
        return JsonResponse({"result": result})

    def previsions_echeances(self, request, start, end):
        """return echeances from all echeancier between two dates

        Args:
            request (request): request object
            start (string): start month (YYYY-MM)
            end (string): end month (YYYY-MM)

        Returns:
            JsonResponse: result
        """
        result = get_echeances_between(
            "{0}-2".format(start), "{0}-25".format(end)
        )
        for r in result:
            r["date"] = "{0}-{1}".format(r["date"].year, r["date"].month)
        return JsonResponse({"result": result})

    def previsions_list(self, request):
        """
        provide the list of the previsions for the next ten months

        :param request:
        :return:
        """
        return JsonResponse({"result": get_monthly_previsions()})

    def get_encours(self, request):
        """provide all encours

        Args:
            request (request): request object
        """
        return JsonResponse({"result": self.encours_service.get()})

    def get_month_summary(self, request, year, month):
        """
        provide the month_summary
        :param request:
        :return:
        """
        return JsonResponse({"result": self.encours_service.get()})
