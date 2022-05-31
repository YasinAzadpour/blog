from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def index(request):
    return render(request, 'index.html',{'title': 'Home'})

def post_detail(request,username, slug): 
    return render(request, 'index.html',{'title': ''})

def people_view(request,username):
    return render(request, 'index.html',{'title': ''})

def tag_view(request,name):
    return render(request, 'index.html',{'title': ''})

def search(request):
    return render(request, 'index.html',{'title': 'Search'})

@login_required(login_url='/accounts/sign-in')
def edit_post(request, id):
    return render(request, 'index.html',{'title': 'Edit'})

@login_required(login_url='/accounts/sign-in')
def write(request):
    return render(request, 'index.html',{'title': 'Write'})

@login_required(login_url='/accounts/sign-in')
def bookmarks(request):
    return render(request, 'index.html',{'title': 'Bookmarks'})

@login_required(login_url='/accounts/sign-in')
def settings(request):
    return render(request, 'index.html',{'title': 'Settings'})

@login_required(login_url='/accounts/sign-in')
def me(request):
    return render(request, 'index.html',{'title': 'Me'})
