import json
from authlib.integrations.django_client import OAuth
from django.conf import settings
from django.shortcuts import redirect, render
from django.urls import reverse
from urllib.parse import quote_plus, urlencode

from .models import StockPrediction
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import date
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
from keras.layers import LSTM, Dense
from keras.models import Sequential
from keras.utils import plot_model
import yfinance as yf

from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *


oauth = OAuth()

oauth.register(
    "auth0",
    client_id=settings.AUTH0_CLIENT_ID,
    client_secret=settings.AUTH0_CLIENT_SECRET,
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f"https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration",
)

def login(request):
    return oauth.auth0.authorize_redirect(
        request, request.build_absolute_uri(reverse("callback"))
    )

def callback(request):
    token = oauth.auth0.authorize_access_token(request)
    request.session["user"] = token
    return redirect(request.build_absolute_uri(reverse("index")))

def logout(request):
    request.session.clear()

    return redirect(
        f"https://{settings.AUTH0_DOMAIN}/v2/logout?"
        + urlencode(
            {
                "returnTo": request.build_absolute_uri(reverse("index")),
                "client_id": settings.AUTH0_CLIENT_ID,
            },
            quote_via=quote_plus,
        ),
    )

def index(request):
    return render(
        request,
        "index.html",
        context={
            "session": request.session.get("user"),
            "pretty": json.dumps(request.session.get("user"), indent=4),
        },
    )

def get_lstm_prediction(ticker, start_date):
    
    end_date = date.today().strftime("%Y-%m-%d")
    data = yf.download(ticker, start=start_date, end=end_date)

    # Save the data to a CSV file
    data.to_csv("Ticker.csv")
    df=pd.read_csv("Ticker.csv",na_values=['null'],index_col='Date',parse_dates=True,infer_datetime_format=True)
    df["Date"] = pd.to_datetime(df.index,format='%Y-%m-%d')
    df.head()

    # %%
    #Print the shape of Dataframe and check for null values
    print("Dataframe Shape:",df.shape)
    print("Null Values (if any):",df.isnull().values.any())


    # %%
    #Plot the closing price of the stock
    df.plot(x='Date',y='Adj Close', xlabel = 'Date', ylabel = 'Price (USD)', title = 'Microsoft Stock Price')

    # %%
    #Set target variable as the closing price
    output_var = pd.DataFrame(df['Adj Close'])
    #Selecting the features
    features = ['Open','High','Low','Volume']

    # %%
    #Setting up scaler
    scaler = MinMaxScaler()
    feature_transform = scaler.fit_transform(df[features])
    feature_transform = pd.DataFrame(data=feature_transform, columns=features, index=df.index)

    # %%
    #Splitting to train and test set
    timesplit = TimeSeriesSplit(n_splits=10)#?
    for train_index, test_index in timesplit.split(feature_transform):
        X_train, X_test = feature_transform[:len(train_index)], feature_transform[len(train_index): (len(train_index)+len(test_index))]
        Y_train, Y_test = output_var[:len(train_index)].values.ravel(), output_var[len(train_index): (len(train_index)+len(test_index))].values.ravel()

    # %%
    #Data Proessing for LSTM
    trainX = np.array(X_train)
    testX = np.array(X_test)
    X_train = trainX.reshape(trainX.shape[0], 1, trainX.shape[1])
    X_test = testX.reshape(testX.shape[0], 1, testX.shape[1])


    # %%
    #LSTM Model
    lstm = Sequential()
    lstm.add(LSTM(32, input_shape=(1, trainX.shape[1]), activation='relu', return_sequences=False))
    lstm.add(Dense(1))
    lstm.compile(loss='mean_squared_error', optimizer='adam')

    # %%
    #Training the Model
    lstm.fit(X_train, Y_train, epochs=200, batch_size=8, verbose=1, shuffle=False)

    # %%
    #Prediction
    Y_pred = lstm.predict(X_test)

    # %%
    # Fetch the latest data and making a future prediction
    latest_data = df.iloc[-1][features].values.reshape(1, len(features))
    latest_data_scaled = scaler.transform(latest_data.reshape(1, -1))
    next_day_prediction = lstm.predict(latest_data_scaled.reshape(1, 1, len(features)))
    next_day = df.index[-1] + pd.Timedelta(days=1)
    return next_day_prediction[0, 0]

def predict(request, display_type="All", specified_ticker=""):
    if request.method == 'POST':
        ticker = request.POST['ticker']
        start_date = request.POST['startDate']

        # Get the LSTM prediction using script
        lstm_prediction = get_lstm_prediction(ticker, start_date)

        # Save the prediction to the database
        StockPrediction.objects.create(ticker=ticker, start_date=start_date, prediction=lstm_prediction)

    # Retrieve predictions from the database
    if display_type == "All":
        predictions = StockPrediction.objects.all()
    elif display_type == "Ordered":
        predictions = StockPrediction.objects.all().order_by('ticker')
    elif display_type == "Specific":
        predictions = StockPrediction.objects.filter(ticker=specified_ticker)
    else:
        predictions = StockPrediction.objects.all()

    return render(request, 'predict.html', {'predictions': predictions})

    # return render(request, "predict.html")

class ReactView(APIView):
    def get(self, request):
        output = [{"ticker": output.ticker,
                    "startDate": output.startDate,
                    "predictedValue": output.predictedValue}
                    for output in StockPrediction.objects.all()]
        return Response(output)
    def post(self, request):
        serializer = ReactSerializer(date=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
