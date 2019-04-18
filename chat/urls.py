# chat.urls
from django.urls import path
# from . import views
from chat.views import index

app_name = 'chat'
urlpatterns = [
	path('', index, name='index'),
]
