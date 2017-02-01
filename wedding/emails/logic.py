import json

from django.core.mail import send_mail
from django.conf import settings
from django.template import Context


def send_nice_email(title='', json_context=None, context_dict=None, template=None):
    context = {}
    if json_context:
        context = json.loads(json_context)
    if context_dict:
        context = context_dict
    if not template:
        return
    print(context)
    body = template.render(Context(context))
    try:
        send_mail(title, '', settings.SENDER_EMAIL, settings.ADMIN_EMAILS, html_message=body)
    except Exception:
        pass