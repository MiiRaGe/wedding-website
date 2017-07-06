import json

from django.utils.translation import ugettext as _
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.conf import settings
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect

from emails.logic import send_nice_email
from emails.templates import RSVP
from home.forms import AuthenticationForm

from home.models import JSONFormValues


@login_required
def index(request):
    if request.method == 'POST':
        value_to_store = request.body.decode('utf8')
        form_id = request.session.get('form_id')
        if form_id:
            JSONFormValues.objects.filter(id=request.session.get('form_id')).update(responses=value_to_store)
            if settings.ADMIN_EMAILS:
                try:
                    send_nice_email(title='Someone just updated their RSVP', json_context=value_to_store, template=RSVP)
                except Exception:
                    pass
        else:
            form_value = JSONFormValues.objects.create(responses=value_to_store)
            request.session['form_id'] = form_value.id
            form_id = form_value.id
            if settings.ADMIN_EMAILS:
                try:
                    send_nice_email(title='Someone just RSVP', json_context=value_to_store, template=RSVP)
                except Exception:
                    pass
        return HttpResponse(form_id)
    return render(request, 'index.html', {'photo_url': settings.PHOTO_URL})


@login_required
def previous_response(request, response_id):
    print(response_id, request.session.get('form_id'))
    if int(response_id) != request.session.get('form_id'):
        return JsonResponse({'response': []})
    return JsonResponse({'response': json.loads(JSONFormValues.objects.get(id=request.session.get('form_id')).responses)})


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
                form.add_error('wedding_date', ValidationError(_('Date de mariage incorrect, verifier l\'invitation')))
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', context={'form': form})
