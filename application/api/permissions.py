from rest_framework import permissions
from .models import *
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomerPermission(BasePermission):
    def has_permission(self, request, view):
        try:
            exist_customer = Customer.objects.get(pk=request.user.id)

            if exist_customer:
                return True
            return False
        except Customer.DoesNotExist:
            return False

class BankEmployeePermission(BasePermission):
     def has_permission(self, request, view):
        try:
            exist_customer = BankEmployee.objects.get(pk=request.user.id)
            if exist_customer:
                return True
            return False
        except BankEmployee.DoesNotExist:
            return False   


class LoanProviderPermission(BasePermission):
     def has_permission(self, request, view):
        try:
            exist_customer = LoanProvider.objects.get(pk=request.user.id)
            if exist_customer:
                return True
            return False
        except LoanProvider.DoesNotExist:
            return False   
    

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.id == request.user.id
    

class IsLoanRequestOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.customer.id == request.user.id


class IsLoanOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.customer.id == request.user.id
    
class IsInstallmentOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.loan.customer.id == request.user.id






