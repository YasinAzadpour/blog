from django.urls import path
from .views import *


app_name = 'posts'

urlpatterns = [
    path('', index, name='index'),
    path('@<username>/<slug>', post_detail, name='post_detail'),
    path('@<username>', people_view, name='people_view'),
    path('write/<id>', edit_post, name='edit_post'),
    path('write', write, name='write'),
    path('t/<name>', tag_view, name='tags_view'),
    path('search', search, name='search'),
    path('bookmarks', bookmarks, name='bookmarks'),
    path('me/settings', settings, name='settings'),
    path('me', me, name='me'),
]
