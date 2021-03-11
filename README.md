# What is Quizzer
Quizzer is a web application where you can create and solve quizzes

## Requirements
* Python 3.8
	* Pipenv (package) 
* Yarn 7.10.4

## Configuration and Installation
* Clone the repository git clone `https://github.com/Kamil732/Quizzer-DRF`

If you don't have `pipenv` then install that using `pip install pipenv`

Open terminal and go to the **frontend/** and install all yarn packages using `yarn install` then start frontend using `yarn start`.  
To start backend server you need to go to the **backend/** and start virtual envirement using `pipenv shell`, then you need to install all requirements using `pipenv install`.  
After that you need to go to the **backend/quizziz/** and run `python manage.py runserver`.

If each step is done, then:
* The frontend will be at this URL http://localhost:3000
* The backend will be at this URL http://127.0.0.1:8000

## Create superuser
To become the superuser you have to run `python manage.py createsuperuser` at **backend/quizziz/**

## Run backend tests
To run all backend tests you have to run `python manage.py test` at **backend/quizziz/**
