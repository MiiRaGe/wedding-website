from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation.trans_real import parse_accept_lang_header, language_code_re, \
    get_supported_language_variant


class DateAuthentication(ModelBackend):
    def authenticate(self, wedding_date=None):
        user_model = get_user_model()
        try:
            if wedding_date == settings.WEDDING_DATE:
                return user_model.objects.get(first_name='Guest', last_name='Guest', is_staff=False)
        except ObjectDoesNotExist:
            return


class AcceptLanguageSetsCookie(object):
    def process_response(self, request, response):
        accept = request.META.get('HTTP_ACCEPT_LANGUAGE', '')
        language_code = None
        for accept_lang, unused in parse_accept_lang_header(accept):
            if accept_lang == '*':
                break

            if not language_code_re.search(accept_lang):
                continue

            try:
                language_code = get_supported_language_variant(accept_lang)
                break
            except LookupError:
                continue
        if language_code and not request.COOKIES.get('django_language'):
            response.set_cookie('django_language', language_code)
        return response