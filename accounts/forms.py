from django.contrib.auth.forms import UserCreationForm
from .models import MyUser as User


class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username','email')

