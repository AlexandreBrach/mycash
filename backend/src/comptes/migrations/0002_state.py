# Generated by Django 3.2.22 on 2024-03-06 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comptes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('solde', models.DecimalField(decimal_places=2, max_digits=9)),
            ],
        ),
    ]
