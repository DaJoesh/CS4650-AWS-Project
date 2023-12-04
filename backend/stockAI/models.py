from django.db import models

# Create your models here.

class React(models.Model):
    ticker = models.CharField(max_length=6)
    startDate = models.DateField()
    predictedValue = models.DecimalField(max_digits=20,decimal_places=2)