from django.contrib.auth import logout
from django.shortcuts import redirect, render


def auth(request):
    if request.user.is_authenticated:
        return redirect('/')
        
    return render(request, 'index.html')


def log_out(request):
    logout(request)
    return redirect('accounts:sign_in')