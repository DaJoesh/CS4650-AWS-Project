from django.db import models

# Create your models here.


class StockPrediction(models.Model):
    ticker = models.CharField(max_length=10)
    start_date = models.DateField()
    prediction = models.FloatField()

