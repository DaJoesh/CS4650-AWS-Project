import json
import time
from os import getenv, environ as env
from urllib.parse import quote_plus, urlencode
from dotenv import load_dotenv, find_dotenv
from flask import Flask, render_template, request, url_for, redirect, jsonify, session, request, Response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import and_, extract
import datetime
from flask_bcrypt import Bcrypt

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

        email = data.get('email')
        name = data.get("name")
        unhashed_password = data.get("password")
        #hashed_password = Bcrypt.generate_password_hash(unhashed_password).decode('utf-8') 

        # Check to see if user already exists in server
        curr_user = db.session.query(User).filter(User.email == email).all() 
        if(len(curr_user) > 0):
            raise Exception("User already signed up")

        ## adding to user category
        new_user = User(email=email, name=name, password=unhashed_password)
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

# Run the Flask app in the main thread
if __name__ == "__main__":
    app.run(host="localhost", port=3000)