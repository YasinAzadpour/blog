import json

from accounts.forms import SignUpForm
from django.contrib.auth import get_user_model, login
from django.contrib.auth.forms import AuthenticationForm
from django.http.response import JsonResponse
from django.views.decorators.http import require_POST


User = get_user_model()


@require_POST
def sign_in(request):
    if request.user.is_authenticated:
        return JsonResponse({'result': 0})

    passwd = request.POST['password']
    request.POST = clean_data(request.POST)|{"password1": passwd, "password2": passwd}

    form = AuthenticationForm(request, request.POST)
    
    if form.is_valid():
        print("is valid")
        login(request, form.get_user())
    
    return JsonResponse(errors_to_json(form))


@require_POST
def sign_up(request):
    if request.user.is_authenticated:
        return JsonResponse({'result': 0})
    passwd = request.POST['password']
    username = request.POST['username']
    request.POST = clean_data(request.POST)|{"password1": passwd, "password2": passwd, 'username': username.lower()}

    form = SignUpForm(request.POST)
    
    if form.is_valid():
        print("is valid")
        user = form.save()
        login(request, user)
    
    return JsonResponse(errors_to_json(form))



def errors_to_json(form):

    if form.errors:
        data = json.loads(form.errors.as_json())
        for key, value in data.items():
            data[key] = value[0]['message']
        
        data['result'] = 0

        return data

    return {'result': 1}

def clean_data(data):
    newData = {}
    for key,value in data.items():
        newData[key] = value[0] if isinstance(value, list) else value
    
    return newData

