from django.contrib.auth import logout
from django.shortcuts import redirect, render


def auth(request):
    if request.user.is_authenticated:
        return redirect('/')
    title  = request.META['PATH_INFO'].split("/")[2].replace('-',' ').capitalize()
    return render(request, 'index.html', {'title': title})
