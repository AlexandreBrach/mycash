# Generated by Django 3.2.22 on 2024-05-02 20:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comptes', '0010_monthyear'),
    ]

    operations = [
        migrations.AlterField(
            model_name='monthsummary',
            name='startSolde',
            field=models.DecimalField(decimal_places=2, max_digits=9, null=True),
        ),
    ]
