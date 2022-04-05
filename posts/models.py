from django.db import models
from django.utils.translation import gettext_lazy as _


class Post(models.Model):
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    text =  models.TextField(max_length=20_000)
    date = models.DateField(auto_now=True)
    read_time = models.IntegerField()
    slug = models.SlugField(unique=True)
    published = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.title}'
    

