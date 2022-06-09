from turtle import width
from django.db import models
from django.utils.translation import gettext_lazy as _


class Post(models.Model):
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE, related_name="user_posts")
    title = models.CharField(max_length=50)
    text =  models.TextField(max_length=20_000)
    date = models.DateTimeField(auto_now=True)
    slug = models.CharField(max_length=50)
    published = models.BooleanField(default=False)
    tags = models.ManyToManyField('Tag', blank=True, related_name='taged_post')
    liked_users = models.ManyToManyField('accounts.MyUser', blank=True, related_name="liked_users")

    @property
    def like_count(self):
        return self.liked_users.all().count()

    def bookmark_post(self, user):
        if user in self.bookmarked_users.all():
            self.bookmarked_users.remove(user)
        else:
            self.bookmarked_users.add(user)

        return True

    def like_post(self, user):
        try:
            if user in self.liked_users.all():
                self.liked_users.remove(user)
            else:
                self.liked_users.add(user)
            return True
        except:
            return False

    def __str__(self):
        return f'{self.title}'
    
    def as_json(self, user=None):
        author_fallowed = user in self.user.fallowers if user else False
        liked = user in self.liked_users.all() if user else False
        bookmark = self in user.bookmarks if user else False

        data = {
            'id': self.pk,
            'user': self.user.as_json(user)|{"fallowed": author_fallowed },
            'title': self.title,
            'text': self.text,
            'date': self.date,
            'slug': self.slug,
            'isPub': self.published,
            'tags': [i.as_json() for i in self.tags.all()],
            'likes': self.like_count,
            'bookmark': bookmark,
            'liked': liked,
            'comments': self.comments.count()
        }
        return data

    @classmethod
    @property
    def latests(cls):
        return cls.objects.filter(published=True).order_by('-date')

    @property
    def comments(self):
        return self.post_comment.all()

    @classmethod
    def fallowings(cls, user):
        result = []
        for i in user.fallowings:
            result += [post for post in i.posts]
        return result
        
    @classmethod
    @property
    def top(cls):
        query = list(cls.objects.all())
        query.sort(key=lambda post: post.like_count + len(post.text) * 0.01 + (post.date.timestamp()*2), reverse=True)
        return query[:100]

    @classmethod
    def search(cls, text):
        if text.isspace():
            return []

        query = list(cls.objects.filter(title__icontains=text, published=True))
        # use like count and post length and post date to roder 
        query.sort(key=lambda post: post.like_count + len(post.text) * 0.01 + (post.date.timestamp()*2), reverse=True)
        return query[:100]

class Tag(models.Model):
    name = models.SlugField(max_length=50, unique=True)

    @property
    def fallowers(self):
        return self.users.all()

    def as_json(self, user=None):
        data = {
            'id': self.pk, 
            'name': self.name,
            'fallowers': self.fallowers.count(),
            'fallowed':  self in user.tags if user else False
            }
        return data
        
        
    @classmethod
    @property
    def top(cls):
        query = list(cls.objects.all())
        query.sort(key=lambda tag: tag.fallowers.count(), reverse=True)
        return query[:100]

    @classmethod
    def search(cls, text):
        if text.isspace():
            return []

        query = list(cls.objects.filter(name__istartswith=text))
        query.sort(key=lambda tag: tag.fallowers.count(), reverse=True)
        return query[:100]

    @property
    def posts(self):
        return self.taged_post.filter(tags=self).order_by('-date')

    def __str__(self):
        return f'{self.name}'
    

class Comment(models.Model):
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE, related_name="user_comments")
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE, related_name="post_comment")
    text =  models.TextField(max_length=1000)
    date = models.DateTimeField(auto_now=True)
    replaied_to = models.ForeignKey('self', on_delete=models.CASCADE, related_name="responses", null=True, blank=True)


    def as_json(self, with_res=True):
        data = {
            'id': self.pk,
            'user': self.user.as_json(),
            'text':  self.text,
            'data': self.date,
            }
        if with_res:
            data['responses']= [i.as_json(False) for i in self.responses.all()]

        return data

    def __str__(self):
        return f'{self.user.name} > {self.post.title}'
    
