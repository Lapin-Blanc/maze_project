# maze.urls
from django.urls import path

from .views import index, edit_level, pixel_preview, pixel_index

app_name = 'maze'
urlpatterns = [
    path('edit/<int:level_id>/', edit_level, name='edit'),
    path('create/', edit_level, name='create'),
    path('', index, name='index'),

    path('pixel/edit/<int:pixel_id>/', pixel_preview, name='pixel_preview'),
    path('pixel/create', pixel_preview, name='pixel_create'),
    path('pixel/', pixel_index, name='pixel_index'),
]
 
