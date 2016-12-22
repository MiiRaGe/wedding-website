from django.db import models


class JSONFormValues(models.Model):
    responses = models.TextField()