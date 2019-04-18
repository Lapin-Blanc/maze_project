from django.urls import path
from .views import index, edit_level, char_preview

app_name = 'maze'
urlpatterns = [
    path('create/', edit_level, name='create'),
    path('edit/<int:level_id>/', edit_level, name='edit'),
    path('character/<int:char_id>/', char_preview, name='char_preview'),
    path('', index, name='index'),
]
 
