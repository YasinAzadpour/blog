from django.http import Http404
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from posts.models import Post, Tag
from django.contrib.auth import get_user_model

User = get_user_model()


def index(request):
    return render(request, 'index.html',{'title': 'Home'})

def post_detail(request,username, slug):
    query = Post.objects.filter(user__username=username, slug=slug)
    if query.exists():
        return render(request, 'index.html',{'title': query.first().title})
    raise Http404
    
def people_view(request,username):
    query = User.objects.filter(username=username)
    if query.exists():
        return render(request, 'index.html',{'title': query.first().name})
    raise Http404

def tag_view(request,name):
    query = Tag.objects.filter(name=name)
    if query.exists():
        return render(request, 'index.html',{'title': "# " + query.first().name})
    raise Http404
    
def search(request):
    return render(request, 'index.html',{'title': 'Search'})

@login_required(login_url='/accounts/login')
def edit_post(request, id):
    query = Post.objects.filter(pk=id)
    if query.exists():
        return render(request, 'index.html',{'title': query.first().title})
    raise Http404

@login_required(login_url='/accounts/login')
def write(request):
    return render(request, 'index.html',{'title': 'Write'})

@login_required(login_url='/accounts/login')
def bookmarks(request):
    return render(request, 'index.html',{'title': 'Bookmarks'})

@login_required(login_url='/accounts/login')
def settings(request):
    return render(request, 'index.html',{'title': 'Settings'})

@login_required(login_url='/accounts/login')
def me(request):
    return render(request, 'index.html',{'title': 'Me'})
