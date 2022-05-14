from django.urls import path
from .views import *


app_name = 'api'

urlpatterns = [
    path('accounts/sign-in', sign_in, name='sign_in'),
    path('accounts/sign-up', sign_up, name='sign_up'),
    path('me', me, name='me'),
]
