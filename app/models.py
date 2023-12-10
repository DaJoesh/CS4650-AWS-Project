from django.db import models
from backend.settings import *
from django.utils import timezone

def get_default_date():
    return timezone.now().date()

class React(models.Model):
    ticker = models.CharField(max_length=30, default='na')
    startDate = models.DateField(default=get_default_date, blank=True)
    predictedValue = models.CharField(max_length=30, default='na')
