from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *

class ReactView(APIView):
    def get(self,request):
        output = [{'ticker':output.ticker, 'startDate': output.startDate, 'predictedValue':output.predictedValue}
                   for output in React.objects.all()]
        return Response(output)
        
    def post(self,request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception = True):
            serializer.save()
            return Response(serializer.data)


# Create your views here.
