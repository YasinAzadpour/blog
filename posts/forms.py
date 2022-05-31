from django import forms
from posts.models import Post

class PostForm(forms.ModelForm):
    
    class Meta:
        model = Post
        fields = ('user','title','text','slug','published','tags')
    
