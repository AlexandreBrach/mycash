# Generated by Django 3.2.22 on 2024-03-06 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comptes', '0002_state'),
    ]

    operations = [
        migrations.AlterField(
            model_name='state',
            name='solde',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=9),
        ),
    ]
