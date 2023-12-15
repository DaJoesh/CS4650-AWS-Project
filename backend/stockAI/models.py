from django.db import models
from django.utils import timezone

# Create your models here.

def get_default_date():
    return timezone.now().date()

class StockPrediction(models.Model):
    ticker = models.CharField(max_length=30, default='na')
    startDate = models.DateField(default=get_default_date, blank=True)
    predictedValue = models.CharField(max_length=30, default='na')

