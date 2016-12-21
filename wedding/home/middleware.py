from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import ObjectDoesNotExist


class DateAuthentication(ModelBackend):
    def authenticate(self, wedding_date=None):
        user_model = get_user_model()
        try:
            if wedding_date == settings.WEDDING_DATE:
                return user_model.objects.get(first_name='Guest', last_name='Guest', is_staff=False)
        except ObjectDoesNotExist:
            return
