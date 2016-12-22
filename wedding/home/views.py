import json

from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from django.shortcuts import render, redirect

from home.forms import AuthenticationForm

from home.models import JSONFormValues


@login_required
def index(request):
    if request.method == 'POST':
        value_to_store = json.dumps(request.POST)
        JSONFormValues.objects.create(responses=value_to_store)
        return HttpResponse('Succes')
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


def date_login(request):
    if not request.user.is_anonymous:
        return redirect('index')

    if request.method == 'POST':
        form = AuthenticationForm(request.POST)
        if form.is_valid():
            cleaned_data = form.cleaned_data
            user = authenticate(wedding_date=cleaned_data['wedding_date'])
            if user:
                login(request, user)
                return redirect('index')
            else:
                form.add_error('wedding_date', ValidationError('Date de mariage incorrect, verifier l\'invitation'))
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', context={'form': form})
