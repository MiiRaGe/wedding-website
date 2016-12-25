import json

from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from home.models import JSONFormValues


@staff_member_required
def response_management(request):
    return render(request, 'responses_management.html')


@staff_member_required
def all_responses(request):
    json_values = JSONFormValues.objects.all()
    all_responses = {
        'responses': []
    }
    for json_value in json_values:
        responses = json.loads(json_value.responses)
        all_responses['responses'].extend(responses.get('form', [{}]))
    return JsonResponse(all_responses)
