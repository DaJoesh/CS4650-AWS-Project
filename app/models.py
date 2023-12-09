from django.db import models

class React(models.Model):
    ticker = models.CharField(max_length=6)
    startDate = models.DateField()
    predictedValue = models.CharField(max_length=6)
