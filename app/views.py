from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
from datetime import datetime

class ReactView(APIView):
    serializer_class = ReactSerializer
    
    def get(self, request):
        # Assuming 'ticker' and 'date' are sent as query parameters
        ticker = request.query_params.get('ticker')
        date = request.query_params.get('date')

        # Filtering data based on ticker and date if they exist
        if ticker:
            output = React.objects.filter(ticker=ticker)
        else:
            output = React.objects.all()
        
        if date:
            try:
                # Assuming the date is sent in 'yyyy-mm-dd' format from React
                formatted_date = datetime.strptime(date, '%Y-%m-%d').date()
                # Use formatted_date for further processing in Django
            except ValueError:
                # Handle incorrect date format sent from React
                return Response({'error': 'Invalid date format. Expected yyyy-mm-dd.'}, status=400)

        serializer = ReactSerializer(output, many=True)
        return Response(serializer.data)
        
    def post(self,request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception = True):
            serializer.save()
            return Response(serializer.data)


# Create your views here.
