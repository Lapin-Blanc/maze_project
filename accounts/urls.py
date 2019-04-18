# accounts.urls
from django.urls import path
# from . import views
from accounts.views import home

app_name = 'accounts'
urlpatterns = [
	path('', home, name='home'),
]
