# Stock Predictor AI

## Overview
Stock Predictor AI is a machine learning powered stock trend prediction web application. The application is built using Flask for the backend and React for the frontend, providing users with AI-driven stock market insights. The platform is hosted on AWS, ensuring scalability and availability.

## Features
- AI-based stock trend predictions using historical market data.
- User authentication and secure data storage.
- Interactive and dynamic frontend built with React.
- Backend API powered by Flask, handling prediction requests.
- Hosted on AWS for cloud-based accessibility.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Flask (Python)
- **Database:** MySQL (SQLAlchemy for ORM)
- **Machine Learning:** Scikit-learn, LSTM model for trend analysis
- **Hosting:** AWS (EC2)
- **Authentication:** Flask-Bcrypt, JWT
- **API Handling:** Flask-CORS

## Prerequisites
Ensure that you have the following installed before proceeding:
- Python 3.x
- Node.js and npm
- Virtual environment package (`venv`)
- AWS CLI (if deploying to AWS)

## Installation and Setup

### Backend Setup
1. Navigate to the project directory:
   ```sh
   cd CS4650-AWS-Project
   ```
2. Create a virtual environment:
   ```sh
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows (PowerShell):
     ```sh
     Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser  # (First time only)
     .\venv\Scripts\Activate.ps1
     ```
   - On macOS/Linux:
     ```sh
     source venv/bin/activate
     ```
4. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
5. Navigate to the backend directory:
   ```sh
   cd backend
   ```
6. Create a `.env` file in the backend directory and add the environment variables (refer to the pinned message in Discord for required values).
7. Run database migrations:
   ```sh
   python manage.py migrate
   ```
8. Start the backend server:
   ```sh
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```


