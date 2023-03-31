# Generated by Django 4.1.7 on 2023-03-28 15:45

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_instalment_installment'),
    ]

    operations = [
        migrations.RenameField(
            model_name='loanrequest',
            old_name='termInMonth',
            new_name='term_in_months',
        ),
        migrations.AddField(
            model_name='loanrequest',
            name='start_date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
