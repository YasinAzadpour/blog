from django import forms
from posts.models import Image, Post, Comment

class PostForm(forms.ModelForm):
    
    class Meta:
        model = Post
        fields = ('user','title','text','slug','published','tags')
    
class CommentForm(forms.ModelForm):
    
    class Meta:
        model = Comment
        fields = ('user','post','text','replaied_to')

        
class ImageForm(forms.ModelForm):
    
    class Meta:
        model = Image
        fields = ('user', 'image')
