import json
import re

import numpy as np
from accounts.forms import SignUpForm, UpdateUser
from django.conf import settings
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.sessions.models import Session
from django.core.paginator import Paginator
from django.http import Http404
from django.http.response import JsonResponse
from django.middleware import csrf
from django.views.decorators.http import require_POST
from PIL import Image
from posts.forms import CommentForm, ImageForm, PostForm
from posts.models import Post, Tag
from django.core.exceptions import ObjectDoesNotExist
User = get_user_model()


@require_POST
def sign_in(request):
    if request.user.is_authenticated:
        return JsonResponse({'result': 0})

    passwd = request.POST.get('password')
    request.POST = clean_data(request.POST)|{'password1': passwd, 'password2': passwd}

    form = AuthenticationForm(request, request.POST)
    
    if form.is_valid():
        login(request, form.get_user())
    
    return JsonResponse(errors_to_json(form))

@require_POST
def sign_up(request):
    if request.user.is_authenticated:
        return JsonResponse({'result': 0})

    passwd = request.POST.get('password')
    username = request.POST.get('username')
    clean = {'password1': passwd, 'password2': passwd, 'username': username.lower(),'name': username.lower()}
    request.POST = clean_data(request.POST)|clean

    form = SignUpForm(request.POST)
    
    if form.is_valid():
        user = form.save()
        login(request, user)
    
    return JsonResponse(errors_to_json(form))

@require_POST
def change_password(request):
    request.POST = clean_data(request.POST)

    form = PasswordChangeForm(request.user,request.POST)
    
    if form.is_valid():
        user = form.save()
        login(request,user)

    return JsonResponse(errors_to_json(form)|{'csrfmiddlewaretoken': csrf.get_token(request)})

@require_POST
def log_out(request):
    logout(request) 
    return JsonResponse({'result': 1})

@require_POST
def delete_account(request):
    user = request.user
    if user.is_authenticated:
        password = request.POST.get('password')
        is_valid = user.check_password(password)

        if is_valid:
            user.delete()
            return JsonResponse({'result': 1})

        return JsonResponse({'result': 0,'password': 'Incurrect password.'})
        
    return JsonResponse({'result': 0})

@require_POST
def kill_all_other(request):
    user = request.user
    if user.is_authenticated:
        my_session_key = request.session.session_key
        for s in Session.objects.exclude(session_key=my_session_key):
            data = s.get_decoded()
            if data.get('_auth_user_id') == str(user.pk):
                s.delete()

        return JsonResponse({'result': 1})
        
    return JsonResponse({'result': 0})

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

def proc_tags(req):
    tags = []
    for t in req.POST.get('tags','').split(' . '):
        try:
            tags.append(int(t))
        except ValueError:
            if name:=re.sub(r'[\s#\\]+','',t):
                thisTag = Tag.objects.get_or_create(name=name)[0]
                tags.append(thisTag.id)
    return tags

@require_POST
def me(request):
    user = request.user
    if user.is_authenticated:
        return JsonResponse({'result': 1, 'me': user.as_json()})

    return JsonResponse({'result': 0,'me': {}})

@require_POST
def edit(request):
    user = request.user
    if user.is_authenticated:
        request.POST = clean_data(request.POST)
        form = UpdateUser(user.as_json()|request.POST, request.FILES, instance=user)

        if form.is_valid():
            profile = request.FILES.get('profile')                          
            form.save()
            if profile:
                profile = np.array(Image.open(profile))
                user.set_profile(profile)

        data = errors_to_json(form)|{'me': user.as_json()}
        return JsonResponse(data)

    return JsonResponse({'result': 0})

@require_POST
def rec_posts(request):
    # this section still not work
    return JsonResponse({'result': 1, 'items': []})

@require_POST
def fallowings_posts(request):
    user = request.user
    if user.is_authenticated:
        p = Paginator(Post.fallowings(user), 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(user) for i in this_page.object_list]

        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

    return JsonResponse({'result': 0})

@require_POST
def latest_posts(request):
    user = request.user if request.user.is_authenticated else None
    p = Paginator(Post.latests, 15)
    num_page = request.POST.get('page',1)
    this_page = p.get_page(num_page)
    data = [i.as_json(user) for i in this_page.object_list]

    return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})


@require_POST
def my_fallowers(request):
    user = request.user
    if user.is_authenticated:
        p = Paginator(user.fallowers, 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(user) for i in this_page.object_list]

        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

    return JsonResponse({'result': 0})

@require_POST
def my_fallowings(request):
    user = request.user
    if user.is_authenticated:
        p = Paginator(user.fallowings, 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(user) for i in this_page.object_list]

        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

    return JsonResponse({'result': 0})

@require_POST
def my_tags(request):
    user = request.user
    if user.is_authenticated:
        p = Paginator(user.tags, 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(user) for i in this_page.object_list]

        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

    return JsonResponse({'result': 0})


@require_POST
def my_draft_posts(request):
    user = request.user
    if user.is_authenticated:
        p = Paginator(user.dposts, 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(user) for i in this_page.object_list]

        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

    return JsonResponse({'result': 0})

@require_POST
def my_pub_posts(request):
    user = request.user
    if user.is_authenticated:
        p = Paginator(user.posts, 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(user) for i in this_page.object_list]

        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

    return JsonResponse({'result': 0})

@require_POST
def people(request, username):
    try:
        user = request.user if request.user.is_authenticated else None
        other = User.objects.get(username=username)
        return JsonResponse({'result': 1, 'user': other.as_json(user)})
    except ObjectDoesNotExist:
        raise Http404
    
@require_POST
def people_posts(request, username):
    try:
        user = request.user if request.user.is_authenticated else None
        other = User.objects.get(username=username)
        p = Paginator(other.posts, 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(user) for i in this_page.object_list]

        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})
    except ObjectDoesNotExist:
        raise Http404

@require_POST
def tag(request, name):
    try:
        user = request.user if request.user.is_authenticated else None
        tag = Tag.objects.get(name=name)
        return JsonResponse({'result': 1, 'tag': tag.as_json(user)})
    except ObjectDoesNotExist:
        raise Http404

@require_POST
def tag_posts(request, name):
    try:
        user = request.user if request.user.is_authenticated else None
        tag = Tag.objects.get(name=name)
        p = Paginator(tag.posts, 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(user) for i in this_page.object_list]

        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})
    except ObjectDoesNotExist:
        raise Http404

@require_POST
def top_tags(request):
    user = request.user if request.user.is_authenticated else None
    p = Paginator(Tag.top, 15)
    num_page = request.POST.get('page',1)
    this_page = p.get_page(num_page)
    data = [i.as_json(user) for i in this_page.object_list]

    return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

@require_POST
def top_users(request):
    user = request.user if request.user.is_authenticated else None
    p = Paginator(User.top, 15)
    num_page = request.POST.get('page',1)
    this_page = p.get_page(num_page)
    data = [i.as_json(user) for i in this_page.object_list]

    return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

@require_POST
def top_posts(request):
    user = request.user if request.user.is_authenticated else None
    p = Paginator(Post.top, 15)
    num_page = request.POST.get('page',1)
    this_page = p.get_page(num_page)
    data = [i.as_json(user) for i in this_page.object_list]

    return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

@require_POST
def search_tags(request):
    user = request.user if request.user.is_authenticated else None
    text = request.POST.get('text')
    query = Tag.search(text)
    p = Paginator(query, 15)
    num_page = request.POST.get('page',1)
    this_page = p.get_page(num_page)
    tags = [i.as_json(user) for i in this_page.object_list]
    return JsonResponse({'result': 1, 'items': tags, 'hasNext': this_page.has_next()})

@require_POST
def search_posts(request):
    user = request.user if request.user.is_authenticated else None
    text = request.POST.get('text')
    query = Post.search(text)
    p = Paginator(query, 15)
    num_page = request.POST.get('page',1)
    this_page = p.get_page(num_page)
    tags = [i.as_json(user) for i in this_page.object_list]
    return JsonResponse({'result': 1, 'items': tags, 'hasNext': this_page.has_next()})

@require_POST
def search_users(request):
    user = request.user if request.user.is_authenticated else None
    text = request.POST.get('text')
    query = User.search(text)
    p = Paginator(query, 15)
    num_page = request.POST.get('page',1)
    this_page = p.get_page(num_page)
    tags = [i.as_json(user) for i in this_page.object_list]
    return JsonResponse({'result': 1, 'items': tags, 'hasNext': this_page.has_next()})

@require_POST
def post_detail(request, username, slug):
    try:
        user = request.user if request.user.is_authenticated else None
        other = User.objects.get(username=username)
        post = Post.objects.get(slug=slug, user=other)
        return JsonResponse({'result': 1, 'post': post.as_json(user)})
    except ObjectDoesNotExist:
        raise Http404

@require_POST
def post_status(request, id):
    try:
        user = request.user
        if user.is_authenticated:

            id = request.POST.get('id')
            post = Post.objects.get(id=id, user=user)
            post.published = not post.published
            post.save()
            return JsonResponse({'result': 1, 'isPub': post.published})

        return JsonResponse({'result': 0})
    except ObjectDoesNotExist:
        raise Http404

@require_POST
def post_detail_with_id(request, id):
    try:
        user = request.user
        if user.is_authenticated:
            post = Post.objects.get(id=id, user=user)

            return JsonResponse(post.as_json(user)|{'result': 1})

        return JsonResponse({'result': 0})
    except ObjectDoesNotExist:
        raise Http404

@require_POST
def bookmarks(request):
    user = request.user if request.user.is_authenticated else None
    p = Paginator(user.bookmarks, 15)
    num_page = request.POST.get('page',1)
    this_page = p.get_page(num_page)
    data = [i.as_json(user) for i in this_page.object_list]
    return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})

@require_POST
def get_post_comments(request, id):
    query  = Post.objects.filter(id=id)
    if query.exists():
        post = query.first()
        p = Paginator(post.comments, 15)
        num_page = request.POST.get('page',1)
        this_page = p.get_page(num_page)
        data = [i.as_json(True) for i in this_page.object_list]
        return JsonResponse({'result': 1, 'items': data, 'hasNext': this_page.has_next()})
    return JsonResponse({'result': 0})


@require_POST
def add_comment(request):
    user = request.user
    if user.is_authenticated:

        request.POST = clean_data(request.POST)|{'user': user}
        form  = CommentForm(request.POST)
        if form.is_valid():
            c = form.save()
            return JsonResponse({'result': 1, 'comment': c.as_json(False)})

        return JsonResponse(errors_to_json(form))
    
    return JsonResponse({'result': 0})

@require_POST
def upload_image(request):
    user = request.user
    if user.is_authenticated:
        if user.images_size <= settings.MAX_USER_UPLOAD:
            form  = ImageForm({'user': user}, request.FILES)
            if form.is_valid():
                image = form.save()
                return JsonResponse({'result': 1, 'link': image.image.url})

            return JsonResponse(errors_to_json(form))

        return JsonResponse({'result': 0, 'image': 'Your upload limited Go Pro'})
        
    return JsonResponse({'result': 0})

@require_POST
def write(request):
    user = request.user
    if user.is_authenticated:
        tags = proc_tags(request)
        request.POST = clean_data(request.POST)|{'user': user}
        form  = PostForm(request.POST|{'tags': tags})
        post = {}
        if form.is_valid():
            post = form.save().as_json()

        return JsonResponse(errors_to_json(form)|{'id': post.get('id')})
    
    return JsonResponse({'result': 0})

@require_POST
def edit_post(request,id):
    try:
        user = request.user
        tags = proc_tags(request)
        request.POST = clean_data(request.POST)
        post = Post.objects.get(id=id, user=user)
        form  = PostForm(request.POST|{'tags': tags, 'user': user}, instance=post)

        if form.is_valid():
            post = form.save()
            
        return JsonResponse(errors_to_json(form)|{'id': post.id})
    except:
        return JsonResponse({'result': 0})

@require_POST
def delete_post(request, id):
    try:
        user = request.user
        post = Post.objects.get(id=id, user=user)
        post.delete()
        return JsonResponse({'result': 1})
    except:
        return JsonResponse({'result': 0})


@require_POST
def fallow_people(request, username):
    user = request.user
    try:
        assert user.is_authenticated
        other = User.objects.get(username=username)
        user.fallow_people(other)
        return JsonResponse({'result': 1})
    except:
        return JsonResponse({'result': 0})

@require_POST
def fallow_tags(request, name):
    user = request.user
    try:
        assert user.is_authenticated
        tag = Tag.objects.get(name=name)
        user.fallow_tags(tag)
        return JsonResponse({'result': 1})
    except:
        return JsonResponse({'result': 0})

@require_POST
def bookmark_post(request, username, slug):
    user = request.user
    try:
        assert user.is_authenticated
        post = Post.objects.filter(user__username=username, slug=slug).first()
        post.bookmark_post(user)
        return JsonResponse({'result': 1})
    except:
        return JsonResponse({'result': 0})

@require_POST
def like_post(request, username, slug):
    user = request.user
    try:
        assert user.is_authenticated
        post = Post.objects.filter(user__username=username, slug=slug).first()
        post.like_post(user)
        return JsonResponse({'result': 1})
    except:
        return JsonResponse({'result': 0})
