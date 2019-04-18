# chat.forms
from django import forms
from game.models import Game

class GameForm(forms.ModelForm):
    class Meta:
        model = Game
        exclude = ['is_over','players']

