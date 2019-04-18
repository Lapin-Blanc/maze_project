# chat/routing.py
from django.urls import path
from django.conf.urls import include, url

# ~ from . import consumers
import chat.consumers

websocket_urlpatterns = [
    url(r'ws/chat/(?P<game_id>\d+)/', chat.consumers.ChatConsumer),
    path('ws/chat/', chat.consumers.RoomsConsumer),
]
