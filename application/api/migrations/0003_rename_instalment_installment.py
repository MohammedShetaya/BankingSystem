# Generated by Django 4.1.7 on 2023-03-28 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_user_is_customer_remove_user_is_loan_provider_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Instalment',
            new_name='Installment',
        ),
    ]