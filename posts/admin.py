from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'date', 'published')
    list_filter = ('published', )
    search_fields = ('title', 'text', )
