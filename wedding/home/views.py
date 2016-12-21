from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


@login_required
def index(request):
    return render(request, 'index.html')


@login_required
def contact(request):
    return render(request, 'contact.html')


@login_required
def hebergement(request):
    return render(request, 'hebergement.html')


@login_required
def deroulement(request):
    return render(request, 'deroulement.html')


def login(request):
    # if not request.user.is_anonymous:
    #     return redirect('index')
    if request.method == 'POST':
        pass
    return render(request, 'login.html')
