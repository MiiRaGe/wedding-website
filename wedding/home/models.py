from django.db import models
from django.utils import timezone


class JSONFormValues(models.Model):
    responses = models.TextField()
    created = models.DateTimeField(default=timezone.now)