'''urls for profiles app'''
from django.urls import path
from profiles import views

urlpatterns = [
    path('profiles/', views.ProfileList.as_view()),
    path('profiles/invite/', views.ProfileInviteList.as_view()),
    path('profiles/<int:pk>/', views.ProfileDetail.as_view()),
    path('profiles/switch/<int:pk>/', views.ProfileSwitchWorkstream.as_view()),
]
