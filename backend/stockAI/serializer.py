from rest_framework import serializers
from .models import *

class ReactSerializer(serializers.ModelSerializer):
    class Meta: 
        model = StockPrediction
        fields = ['ticker', 'startDate', 'predictedValue']