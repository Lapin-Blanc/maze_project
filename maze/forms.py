from django import forms
from maze.models import Level, Pixel

class LevelForm(forms.ModelForm):
    class Meta :
        model = Level
        exclude = []
        widgets = {
            'name': forms.TextInput(attrs={'size': '25'}),
            'maxBlocks': forms.TextInput(attrs={'size': '11'}),
            'lvl_map': forms.HiddenInput(),
        }

class PixelForm(forms.ModelForm):
    class Meta :
        model = Pixel
        exclude = []
