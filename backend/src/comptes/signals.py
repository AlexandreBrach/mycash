from comptes.services.extraits import extrait_updated
from comptes.services.monthsummary import create_unarchived_month_summary, update_month_summary
from comptes.services.synthese import SyntheseService
from django.dispatch import receiver


@receiver(extrait_updated)
def my_callback(sender, **kwargs):
    service_service = SyntheseService()

    service_service.update_synthese()
    create_unarchived_month_summary()
    update_month_summary()
