import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class User(AbstractUser):
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    
class Customer(User):
    pass
    
class BankEmployee(User):
    pass

class LoanProvider(User):
    pass



class LoanRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    total_amount = models.DecimalField(decimal_places=4, max_digits=15)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    term_in_months = models.IntegerField()
    start_date = models.DateField()
    status = models.CharField(max_length=20, default='pending')

    class Meta:
        ordering = ['updated_at']
    
class Loan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    total_amount = models.DecimalField(decimal_places=4, max_digits=15)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    interest = models.DecimalField(decimal_places=4, max_digits=15)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    accepted_by = models.ForeignKey(BankEmployee, on_delete=models.CASCADE)
    

    class Meta:
        ordering = ['updated_at']

class Installment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    amount = models.DecimalField(decimal_places=4, max_digits=15)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    paid = models.BooleanField(default=False)
    due_date = models.DateField()

    class Meta:
        ordering = ['due_date']


class LoanFund(models.Model):
    amount = models.DecimalField(decimal_places=4, max_digits=15)
    loan_provider = models.ForeignKey(LoanProvider, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['updated_at']