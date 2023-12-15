import json
import time
from os import getenv, environ as env
from urllib.parse import quote_plus, urlencode
from dotenv import load_dotenv, find_dotenv
from flask import Flask, render_template, request, url_for, redirect, jsonify, session, request, Response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import and_, extract
from flask_bcrypt import Bcrypt
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import date, datetime
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
from keras.layers import LSTM, Dense
from keras.models import Sequential
from keras.utils import plot_model
import yfinance as yf
from sqlalchemy.sql import func

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
    
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = env.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app) 

""" CREATING TABLES """

class User(db.Model):
    __table_args__ = {'schema': 'stockpredict'}
    user_id = db.Column(db.Integer, primary_key=True)    
    email = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    ## This defines how the object is returned in string representation
    def __repr__(self):
        return f'<test id={self.user_id}, email={self.email}, name={self.name}, password={self.password} />'
    
class StockPredict(db.Model):
    __table_args__ = {'schema': 'stockpredict'}
    predict_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.user_id), nullable=False)
    ticker = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    predicted_value = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<test predict_id={self.predict_id}, user_id={self.user_id}, ticker={self.ticker}, date={self.date}, timestamp={self.timestamp}, predicted_value={self.predicted_value} />'

# creates all tables defined above. only run this if you're creating a new table.
# with app.app_context():
#     db.create_all()

@app.route("/")
def home():
    """
    The way sql alchemy works is:
    You create a table, and that table will define the schema that you're ulimatly looking for in a db. 
    You can also use this schema to CREATE a table in a db, but we prob won't do that (?) 
    
    Anways, you can query a specific table using .all(), or .filter()
    That will return I a list of all the rows
    You need to iterate through all these rows, and map out the items that come through it as you see fit

    Kinda memory intensive, but whatever. Also might wanna find a way to do this outside of flask,
    Cause for a big table this will take up a LOT of memory  
    """    
    return "World"

@app.route("/login", methods=["POST"])
def login():
    ## check if user exists in database with their password. If yes, return userID, if no, return error
    try:
        data = request.get_json()
        if(data.get('email') == '' or data.get('email') is None or data.get('password') == '' or data.get('password') is None):
            raise Exception("Email or password not specified")

        email = data.get('email')
        password = data.get('password')

        ## verify user exists in db
        curr_user = db.session.query(User).filter(User.email == email).all() 
        if(len(curr_user) < 1 or curr_user == []):
            raise Exception("User not found in DB")
        
        ## now that we know the user exists, check to see that the password is correct
        is_valid = bcrypt.check_password_hash(curr_user[0].password, password) 

        if(is_valid):
            sending_dict = {}
            sending_dict["user_id"] = curr_user[0].user_id
            return jsonify(sending_dict)
        else:
            raise Exception("Invalid password")

    except Exception as e:
        error_message = {"error": f"Server Error: {str(e)}"}
        return jsonify(error_message) 

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        if(data.get('email') == '' or data.get('email') is None or data.get('password') == '' or data.get('password') is None):
            raise Exception("Email or password not specified")

        email = data.get('email')
        name = data.get("username")
        unhashed_password = data.get("password")
        hashed_password = bcrypt.generate_password_hash(unhashed_password).decode('utf-8') 

        # Check to see if user already exists in server
        curr_user = db.session.query(User).filter(User.email == email).all() 
        if(len(curr_user) > 0):
            raise Exception("User already signed up")

        ## adding to user category
        new_user = User(email=email, name=name, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        user_id = new_user.user_id

        return jsonify({"user_id" : user_id})

    except Exception as e:
        error_message = {"error": f"Server Error: {str(e)}"}
        return jsonify(error_message) 
    
    
# CRUD Methods for User
# Add new user route is not needed anymore because login/signup is taking care of it. Still here for testing purposes.
@app.route('/user', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        if(data.get('name') == '' or data.get('name') is None or data.get('email') == '' or data.get('email') is None or data.get('password') == '' or data.get('password') is None):
            raise Exception("Name or Email or password not specified")

        email = data.get("email")
        name = data.get("name")
        unhashed_password = data.get("password")
        hashed_password = bcrypt.generate_password_hash(unhashed_password).decode('utf-8') 

        # Check to see if user already exists in server
        curr_user = db.session.query(User).filter(User.email == email).all() 
        if(len(curr_user) > 0):
            raise Exception("User already signed up")

        ## adding to user category
        new_user = User(email=email, name=name, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return "User added successfully"
    except Exception as e:
        error_message = {"error": f"Error adding user: {str(e)}"}
        return jsonify(error_message)

# Read user info, user_id is required
@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        return jsonify({"name" : user.name, "email" : user.email})
    except Exception as e:
        error_message = {"error": f"Error finding user: {str(e)}"}
        return jsonify(error_message)

# Update user's name, user_id is required
@app.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user = User.query.get(user_id)

        data = request.get_json()
        if(data.get('name') == '' or data.get('name') is None):
            raise Exception("Name not specified")
        
        new_name = data.get('name')
        user.name = new_name
        
        db.session.commit()
        return "User updated successfully"
    except Exception as e:
        error_message = {"error": f"Error updating user: {str(e)}"}
        return jsonify(error_message)

# Delete user and the data associated with them, user_id is required
@app.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Find and delete stock predictions associated with the user
        stock_predictions = StockPredict.query.filter_by(user_id=user_id).all()
        for stock_prediction in stock_predictions:
            db.session.delete(stock_prediction)

        # Finally, delete the user
        user = User.query.get(user_id)
        db.session.delete(user)

        # Commit all changes
        db.session.commit()

        return "User and associated data deleted successfully"
    except Exception as e:
        db.session.rollback()
        error_message = {"error": f"Error deleting user and associated data: {str(e)}"}
        return jsonify(error_message)
    

@app.route("/predict/<user_id>", methods=["POST"])
def get_lstm_prediction(user_id):
    try:
        # Get data from react frontpage
        print("HERE!")
        data = request.get_json()
        if(data.get('ticker') == '' or data.get('ticker') is None or data.get('date') == '' or data.get('date') is None):
            raise Exception("Ticket or Start Date not specified")

        ticker = data.get('ticker')
        start_date = data.get("date")

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

        print("HERE 3!")
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

        # Creating a JSON response with the prediction value
        response_data = {
            "next_day_prediction": float(next_day_prediction[0, 0])
        }

        if(next_day_prediction is None):
            raise Exception("User a older start date please")

        # Save prediction to the database
        new_prediction = StockPredict(
            user_id=user_id,
            ticker=ticker,
            date=start_date,
            timestamp=datetime.now(),
            predicted_value=next_day_prediction[0,0]
        )
        db.session.add(new_prediction)
        db.session.commit()

        # Returning the JSON response
        return jsonify(response_data)

    except Exception as e:
        error_message = {"error": f"Server Error: {str(e)}"}
        return jsonify(error_message)


# READ - Get all predictions
@app.route("/predict/<user_id>", methods=["GET"])
def get_all_predictions(user_id):
    try:
        predictions = StockPredict.query.filter(
            StockPredict.user_id == user_id
        ).order_by(StockPredict.timestamp.desc()).limit(5).all()
    
        if not predictions:
            return jsonify({"message": "No predictions found for this user"})
        
        prediction_list = []
        for prediction in predictions:
            prediction_list.append({
                "ticker": prediction.ticker,
                "date": prediction.date,
                "timestamp": prediction.timestamp,
                "predicted_value": prediction.predicted_value
            })

        return jsonify(prediction_list)

    except Exception as e:
        error_message = {"error": f"Error fetching predictions: {str(e)}"}
        return jsonify(error_message)

# Run the Flask app in the main thread
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)