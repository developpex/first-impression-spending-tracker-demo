# app specific urls
from django.urls import path

# import the views we have crated
from . import views

# call the views when a path is called
urlpatterns = [
    path('', views.index, name='index'),
    path('upload_csv/', views.upload_csv, name='upload_csv'),
    path('get_monthly_spending/', views.get_monthly_spending, name='get_monthly_spending'),
    path('delete_all_transactions/', views.delete_all_transactions, name='delete_all_transactions'),
]