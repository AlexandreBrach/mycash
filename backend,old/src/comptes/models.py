from comptes.extraits.managers import ExtraitManager
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

from comptes.managers.month_summary import MonthSummaryManager


class Categorie(MPTTModel):
    name = models.CharField(max_length=200, unique=True)
    color = models.CharField(max_length=6, unique=False, null=True)
    parent = TreeForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )


class Extrait(models.Model):
    objects = ExtraitManager()

    date = models.DateTimeField(null=False)
    montant = models.DecimalField(max_digits=9, decimal_places=2)
    categorie = models.ForeignKey(
        Categorie,
        null=True,
        on_delete=models.SET_NULL,
    )
    label = models.CharField(max_length=200)
    unicity_flag = models.IntegerField(default=0)
    date_insertion = models.DateTimeField(null=False, auto_now_add=True)
    solde = models.DecimalField(max_digits=9, decimal_places=2, null=True)
    note = models.CharField(max_length=255)
    categorie_month = models.DateField(null=True)

    class Meta:
        unique_together = ("date", "montant", "label", "unicity_flag")


class Synthese(models.Model):
    month = models.IntegerField()
    year = models.IntegerField()
    categorie_id = models.IntegerField()
    categorie_name = models.TextField()
    amount = models.DecimalField(max_digits=9, decimal_places=2)

    def assemble(self):
        return {
            "month": self.month,
            "year": self.year,
            "categorie_id": self.categorie_id,
            "name": self.categorie_name,
            "month_year": str(self.year) + "-" + str(self.month),
            "amount": self.amount,
        }

    class Meta:
        unique_together = ("month", "year", "categorie_id")
        managed = False


class PrevisionRules(models.Model):
    categorie = models.ForeignKey(
        Categorie,
        null=True,
        on_delete=models.SET_NULL,
    )
    period = models.IntegerField()
    amount = models.DecimalField(max_digits=9, decimal_places=2)
    start = models.DateField(null=True)
    end = models.DateField(null=True)


class Echeance(models.Model):
    categorie = models.ForeignKey(
        Categorie,
        null=True,
        on_delete=models.CASCADE,
    )
    amount = models.DecimalField(max_digits=9, decimal_places=2)
    due_date = models.DateField(null=False)
    override = models.BooleanField(default=False)
    collection = models.IntegerField(null=True)


class Prev(models.Model):
    categorie = models.ForeignKey(
        Categorie,
        on_delete=models.CASCADE,
    )
    due_date = models.DateField(null=False)
    amount = models.DecimalField(max_digits=9, decimal_places=2)


class State(models.Model):
    solde = models.DecimalField(max_digits=9, decimal_places=2, default=0)


class MonthSummary(models.Model):
    objects = MonthSummaryManager()

    date = models.DateField(null=False)
    startSolde = models.DecimalField(max_digits=9, decimal_places=2, null=True)
    bilan = models.DecimalField(max_digits=9, decimal_places=2)
    archived = models.BooleanField(default=False)


class Encours(models.Model):
    categorie = models.ForeignKey(
        Categorie,
        null=True,
        on_delete=models.CASCADE,
    )
    amount = models.DecimalField(max_digits=9, decimal_places=2)
    due_date = models.DateField(null=False)
    closed = models.BooleanField(default=False)


class MonthYear(models.Model):
    month = models.IntegerField()
    year = models.IntegerField()

    class Meta:
        managed = False
