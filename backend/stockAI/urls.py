from django.urls import path, include
from stockAI.views import *
from django.contrib import admin
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login, name="login"),
    path("logout", views.logout, name="logout"),
    path("callback", views.callback, name="callback"),
    path("predict/", views.predict, name="predict"),
    path('', ReactView.as_view(), name = "xxx")
]