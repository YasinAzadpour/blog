from django.contrib.auth.forms import UserCreationForm,UserChangeForm
from .models import MyUser as User


class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username','email')

class UpdateUser(UserChangeForm):
    class Meta:
        model = User
        fields = ('name', 'username', 'email', 'profile','bio')