# CS4650-AWS-Project
A stock trading AI that is hosted on AWS

to create virtual environment:

1. cd into CS4650-AWS-Project
2. mkdir venv
3. python3 -m venv venv
4. (first time only) Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
5. .\venv\Scripts\Activate.ps1
6. (first time only) pip install -r requirements.txt
7. cd into "backend" (should look like this: CS4650-AWS-Project\backend)
8. create a .env file
9. add the pinned message in discord to the .env file
10. python manage.py migrate
11. python manage.py runserver
