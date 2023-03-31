from datetime import timedelta
import decimal
from django.contrib.auth import authenticate
from rest_framework.permissions import OR
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import BlacklistMixin
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import permission_required
from django.db.models import Sum
from .models import *
from .serializers import *
from .permissions import *


class TokenVerifyAPIView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        # the token is verfied in the middleware, so when we reach this point, the token is valid
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    


# Authenticate user and generate JWT token
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate user
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        token_payload = {
            'user_id': user.id,
        }

        refresh['payload'] = token_payload

        access_token = str(refresh.access_token)

        return Response({
            'token': access_token,
            'user_id': user.id,
        })

# Customer CRUD operations
# Customer can create a customer
# Customer can retrieve, update and delete himself
# Bank employee can retrieve, update and delete any customer
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_permissions(self):
        permission_classes = []
        
        if self.action == 'create':
            permission_classes = [AllowAny]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [(CustomerPermission & IsOwner) | BankEmployeePermission]
        elif self.action == 'list' or self.action == 'destroy':
            permission_classes = [BankEmployeePermission]
        print(permission_classes)
        return [permission() for permission in permission_classes]


# BankEmployee CRUD operations
# Bank employees can be created by superusers
class BankEmployeeViewSet(viewsets.ModelViewSet):
    queryset = BankEmployee.objects.all()
    serializer_class = BankEmployeeSerializer

    def get_permissions(self):
        permission_classes = []
        if self.request.user.is_superuser:
            permission_classes = [AllowAny]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [BankEmployeePermission & IsOwner]

        return [permission() for permission in permission_classes]


class LoanProviderViewSet(viewsets.ModelViewSet):
    queryset = LoanProvider.objects.all()
    serializer_class = LoanProviderSerializer

    def get_permissions(self):
        permission_classes = []
        if self.request.user.is_superuser:
            permission_classes = [AllowAny]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [LoanProviderPermission & IsOwner]

        return [permission() for permission in permission_classes]        


# LoanRequest CRUD operations
# The customer can create a loan request
# The bank employee can list all loan requests
# The bank employee can retrieve, update and delete a loan request
# The customer can retrieve, update and delete his own loan request
class LoanRequestsViewSet(viewsets.ModelViewSet):
    queryset = LoanRequest.objects.all()
    serializer_class = LoanRequestSerializer

    def get_permissions(self):
        permission_classes = []
        
        if self.action == 'create':
            permission_classes = [CustomerPermission]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [(CustomerPermission & IsLoanRequestOwner) | BankEmployeePermission]
        elif self.action == 'list' or self.action == 'destroy':
            permission_classes = [BankEmployeePermission]

        return [permission() for permission in permission_classes]



# Loan CRUD operations
# the customer can retrieve his own loan
# the bank employee can create a loan
# The bank employee can list all loans
# The bank employee can retrieve, update and delete a loan
class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

    def get_permissions(self):
        permission_classes = []
        
        if self.action == 'create':
            permission_classes = [BankEmployeePermission]
        elif self.action == 'retrieve':
            permission_classes = [(CustomerPermission & IsLoanOwner) | BankEmployeePermission]
        elif self.action == 'update' or self.action == 'partial_update':
            permission_classes = [BankEmployeePermission]
        elif self.action == 'list' or self.action == 'destroy':
            permission_classes = [BankEmployeePermission]
        return [permission() for permission in permission_classes]
    

    
class InstallmentViewSet(viewsets.ModelViewSet):
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer

    def get_permissions(self):
        permission_classes = []
        
        if self.action == 'create':
            permission_classes = [BankEmployeePermission]
        elif self.action == 'retrieve':
            permission_classes = [(CustomerPermission & IsInstallmentOwner) | BankEmployeePermission]
        elif self.action == 'update' or self.action == 'partial_update':
            permission_classes = [BankEmployeePermission]
        elif self.action == 'list' or self.action == 'destroy':
            permission_classes = [BankEmployeePermission]
        return [permission() for permission in permission_classes]


class CustomerLoanRequestsView(APIView):
    permission_classes = [CustomerPermission]

    def get(self, request):

        customer_id = request.GET.get('customer_id')

        if customer_id != str(request.user.id):
            return Response({
                'error': 'You are not allowed to view other customers loans'
            })
        
        loans = LoanRequest.objects.filter(customer=customer_id)   
        serializer = LoanRequestSerializer(loans, many=True)
        
        return Response(serializer.data)    


class CustomerLoansView(APIView):
    permission_classes = [CustomerPermission]

    def get(self, request):

        customer_id = request.GET.get('customer_id')

        if customer_id != str(request.user.id):
            return Response({
                'error': 'You are not allowed to view other customers loans'
            })
        
        loans = Loan.objects.filter(customer=customer_id)   
        serializer = LoanSerializer(loans, many=True)
        
        return Response(serializer.data)    



class CustomerInstallmentsView(APIView):
    permission_classes = [CustomerPermission]

    def get(self, request):

        customer_id = request.GET.get('customer_id')
        loan_id = request.GET.get('loan_id')


        if customer_id != str(request.user.id):
            return Response({
                'error': 'You are not allowed to view other customers installments'
            })
        
        installments = Installment.objects.filter(loan=loan_id)
        serializer = InstallmentSerializer(installments, many=True)
        return Response(serializer.data)
    
  

# accept loan request
# this view is to be executed as one transaction to insure ACID properties of the system. TODO later :)
class AcceptLoanRequestView(APIView):
    permission_classes = [BankEmployeePermission]

    def post(self, request):

        if not request.data.get('loan_request_id'):
            return Response({
                'error': 'Loan request id is required'
            })
        
        loan_request_id = request.data.get('loan_request_id')
        loan_request = LoanRequest.objects.get(id=loan_request_id)

        if (loan_request.status == 'accepted'):
            return Response({
                'message': 'Loan request is already accepted'
        })
        # set the loan request as accepted
        loan_request.status = 'accepted'
        loan_request.save()

        # check if the sum of loan funds is greater than the total amount of the loan request
        available_fund = LoanFund.objects.aggregate(Sum('amount'))['amount__sum']
        available_fund = available_fund - Loan.objects.aggregate(Sum('total_amount'))['total_amount__sum']

        if (available_fund < loan_request.total_amount):
            return Response({
                'error': 'The sum of loan funds is less than the total amount of the loan request'
            })

        
        if (request.data.get('installments')<loan_request.term_in_months):
            return Response({
                'error': 'Installments must be greater than or equal to the term in months'
            })
        

        total_amount_with_interest = loan_request.total_amount + (loan_request.total_amount * decimal.Decimal(request.data.get('interest')))
        installment_amount = total_amount_with_interest / request.data.get('installments')

        employee = BankEmployee.objects.get(pk=request.user.id)
        # create loan
        loan = Loan.objects.create(
            customer = loan_request.customer,
            total_amount = total_amount_with_interest,
            interest = request.data.get('interest'),
            accepted_by = employee
        )

        # create the installments
        for i in range(1, request.data.get('installments')+1):
                
            Installment.objects.create(
                loan = loan,
                amount = installment_amount,
                due_date =  loan_request.start_date + timedelta(days=30*i)
            )

        serializer = LoanSerializer(loan)
        serialized_loan = serializer.data

        # return the serialized loan object as a JSON response
        return Response(serialized_loan, status=status.HTTP_201_CREATED)


# provider makes a deposit to the bank
class DepositFundsView(APIView):
    permission_classes = [LoanProviderPermission | BankEmployeePermission]

    def post(self, request):
            
        if not request.data.get('amount'):
            return Response({
                'error': 'Amount is required'
            })
        
        # create a loan fund 
        loan_provider = LoanProvider.objects.get(pk=request.user.id)
        loan_fund = LoanFund.objects.create(
            amount = request.data.get('amount'),
            loan_provider = loan_provider
        )
        
        return Response()
    
    def get(self, request):
        loan_funds = LoanFund.objects.all()
        serializer = LoanFundSerializer(loan_funds, many=True)
        return Response(serializer.data)



            