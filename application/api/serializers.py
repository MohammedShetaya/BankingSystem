from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.authentication import JWTAuthentication



class CustomerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Customer
        fields = '__all__'

    def create(self, validated_data):                          
        password = validated_data.pop('password')
        customer = Customer.objects.create(**validated_data)
        customer.set_password(password)
        customer.save()
        return customer
    


class BankEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankEmployee
        fields = '__all__'
        
    def create(self, validated_data):                          
        password = validated_data.pop('password')
        employee = BankEmployee.objects.create(**validated_data)
        employee.set_password(password)
        employee.save()
        return employee
    

class LoanProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanProvider
        fields = '__all__'
    
    def create(self, validated_data):                          
        password = validated_data.pop('password')
        provider = LoanProvider.objects.create(**validated_data)
        provider.set_password(password)
        provider.save()
        return provider

class LoanRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = LoanRequest
        fields = '__all__'


class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'


class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = '__all__'

class LoanFundSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanFund
        fields = '__all__'
