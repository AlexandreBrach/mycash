from django.db import models
from django.db.models import Q


class ExtraitManager(models.Manager):

    def main_filter(self, criteria):
        """
        filter overridding the month with categorie_month value if exists

        :param criteria:
        :return:
        """
        qs = super().get_queryset()
        if 'category_id' in criteria:
            category_id = int(criteria['category_id'])
            if category_id != 0:
                qs = qs.filter(categorie=category_id)
        if 'month' in criteria:
            date = criteria['month'].split('-')
            year = int(date[0])
            month = int(date[1])
            qs = qs.filter(date__month=month).filter(date__year=year)
            # remove other monthref
            month = "{0}-01".format(criteria['month'])
            qs = qs.filter(Q(categorie_month=month) | Q(categorie_month__isnull=True))
        if 'categorie_month' in criteria:
            qs = qs.filter(categorie_month=criteria['categorie_month'])
        return qs
