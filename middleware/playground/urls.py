from django.urls import path
from . import views

#URL config
urlpatterns = [
    #because we added playground/ to the urls.py in storefront we dont need to add it here
    path('hello/', views.say_hello),
]