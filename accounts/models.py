import os
from uuid import uuid4

import cv2
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core import files, validators
from django.db import models
from django.db.models import Q
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _


@deconstructible
class UsernameValidator(validators.RegexValidator):
    regex = r'^(?!.*\.\.)(?!.*\.$)[^\W][a-z0-9_.]{2,29}$'
    message = _('Enter a valid username (eg. user_name)')


class MyUser(AbstractUser):

    username_validator = UsernameValidator()

    username = models.CharField(_('username'), unique=True, max_length=30, validators=[username_validator])
    name = models.CharField(_('full name'), blank=True, max_length=50)
    bio = models.CharField(_('biography'), blank=True, max_length=150)
    email = models.EmailField(_('email address'), unique=True)
    profile = models.ImageField(_('profile image'), blank=True, upload_to='users/')
    first_name = last_name = None  # use name instead of first_name and last_name
    fallowing_users = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='fallower_users')
    fallowing_tags = models.ManyToManyField('posts.tag', blank=True, related_name='users')
    bookmarks_post = models.ManyToManyField('posts.Post', blank=True, related_name='bookmarked_users')

    @property
    def tags(self):
        return self.fallowing_tags.all()

    @property
    def bookmarks(self):
        return self.bookmarks_post.all().order_by('-date')

    @property
    def images(self):
        return self.user_images.all()

    @property
    def images_size(self):
        return sum([i.image.size for i in self.images])

    @property
    def fallowings(self):
        return self.fallowing_users.all()

    @property
    def posts(self):
        return self.user_posts.filter(user=self, published=True)

    @property
    def dposts(self):
        return self.user_posts.filter(user=self, published=False)

    @property
    def fallowers(self):
        return self.fallower_users.all()

    def __str__(self) -> str:
        return f"{self.username}"

    def set_profile(self, img, ColorConversionCode=cv2.COLOR_BGR2RGB):
        '''
        output-size : 400*400
        output-path : users/(user.id)/(user.id)-profile.png 
        '''

        try:
            imageY, imageX = img.shape[0], img.shape[1]

            maxSize = imageX if imageX < imageY else imageY
            x = 0 if imageY < imageX else int(imageY/2-(maxSize/2))
            y = 0 if imageX < imageY else int(imageX/2-(maxSize/2))

            img = img[x:x+maxSize, y:y+maxSize]
            img = cv2.cvtColor(img, ColorConversionCode)

            img = cv2.resize(img, settings.PROFILE_SIZE)

            path = f'{settings.USER_PATH}/'
            if not os.path.exists(path):
                os.mkdir(path)
            path += f'{uuid4()}.png'

            self.profile.delete()
            cv2.imwrite(path, img)

            self.profile = files.File(open(path, 'rb')).name.replace('web/media', '')
            self.save()
            return True

        except:
            return False

    def as_json(self, user=None):
        data = {
            'id': self.pk,
            'username': self.username,
            'name': self.name,
            'bio': self.bio,
            'email': self.email,
            'profile': self.profile.url if self.profile else '',
            'fallowers': self.fallowers.count(),
            'fallowings' : self.fallowings.count(),
            'tags': self.tags.count(),
            'fallowed': (user in self.fallowers) or (user in self.tags) if user else False,
        }
        return data

    def fallow_people(self, user):
        if user in self.fallowings:
            self.fallowing_users.remove(user)
        else:
            self.fallowing_users.add(user)
            
        return True

    def fallow_tags(self, tag):
        if tag in self.tags:
            self.fallowing_tags.remove(tag)
        else:
            self.fallowing_tags.add(tag)
            
        return True

    @classmethod
    @property
    def top(cls):
        query = list(cls.objects.all())
        query.sort(key=lambda user: user.fallowers.count() + (user.posts.count()*2))
        return query[:100]
        
    @classmethod
    def search(cls, text):
        if text.isspace():
            return []

        query = list(cls.objects.filter(Q(name__icontains=text)|Q( username__istartswith=text)))
        query.sort(key=lambda user: user.fallowers.count() + (user.posts.count()*2))
        return query[:100]
