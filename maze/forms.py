from django import forms
from maze.models import Level, Character

class LevelForm(forms.ModelForm):
    class Meta :
        model = Level
        exclude = []
