from django.db import models


class MonthSummaryManager(models.Manager):

    def oldest_unarchived(self):
        """
        get the oldest unarvived records from the table (ordered by date)
        """
        qs = super().get_queryset()

        return qs.filter(archived=False).order_by('date')
