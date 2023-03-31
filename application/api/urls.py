from django.urls import path
from rest_framework import routers
from .views import *
from rest_framework_simplejwt.views import (
    TokenVerifyView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register('customer', CustomerViewSet, basename='customer')
router.register('bankEmployee', BankEmployeeViewSet, basename='bankEmployee')
router.register('loanRequest', LoanRequestsViewSet, basename='loanRequest')
router.register('loan', LoanViewSet, basename='loan')
router.register('installment', InstallmentViewSet, basename='installment')
router.register('loanProvider', LoanProviderViewSet, basename='loanProvider')

urlpatterns = router.urls

urlpatterns += [
        path('validateToken/', TokenVerifyAPIView.as_view(), name='token_verify'),
        path('login/', LoginView.as_view(), name='login'),
        path('acceptLoanRequest/', AcceptLoanRequestView.as_view(), name='acceptLoanRequest'),
        path('customerLoanRequests/', CustomerLoanRequestsView.as_view(), name='customerLoanRequests'),
        path('customerLoans/', CustomerLoansView.as_view(), name='customerLoans'),
        path('customerInstallments/', CustomerInstallmentsView.as_view(), name='customerInstallments'),
        path('loanFund/', DepositFundsView.as_view(), name='loanFund'),
]