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

from sqlalchemy.sql import func

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
    
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = env.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)

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

# Run the Flask app in the main thread
if __name__ == "__main__":
    app.run(host="localhost", port=3000)