from django.urls import path
from .views import *


app_name = 'accounts'

urlpatterns = [
    path('login', auth, name='sign_in'),
    path('join', auth, name='sign_up'),
]