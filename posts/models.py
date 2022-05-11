from django.db import models
from django.utils.translation import gettext_lazy as _


class Post(models.Model):
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    text =  models.TextField(max_length=20_000)
    date = models.DateField(auto_now=True)
    slug = models.CharField(max_length=50, unique=True)
    published = models.BooleanField(default=False)
    tags = models.ManyToManyField('Tag', blank=True)


    def __str__(self):
        return f'{self.title}'


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.CharField(max_length=50, unique=True)
    

    def as_json(self):
        return {'id': self.pk, 'name': self.name, 'slug': self.slug}

    def __str__(self):
        return f'{self.name}'
    
