# game.urls
from django.urls import path
import game.views

app_name = 'game'
urlpatterns = [
    path('<int:game_id>/', game.views.room, name='room'),
]
