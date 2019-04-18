# maze.views
from django.shortcuts import render, get_object_or_404
from .models import Level, Character

from django.forms import inlineformset_factory, TextInput, HiddenInput
from maze.models import Character, Level
from maze.forms import LevelForm

from django.http import HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def index(request):
    levels = Level.objects.all()
    return render(request, 'index.html', {'levels':levels})


def edit_level(request, level_id=None):
    CharactersFormSet = inlineformset_factory(
        Level, Character, 
        exclude=[],
        widgets={
            'posX': TextInput(attrs={'size': '2'}),
            'posY': TextInput(attrs={'size': '2'}),
            'downIndex': HiddenInput(attrs={'size': '2'}),
            'nbHPix': HiddenInput(attrs={'size': '2'}),
            'nbVPix': HiddenInput(attrs={'size': '2'}),
            'clockWise': HiddenInput(attrs={'size': '2'}),
            },
        extra=2, min_num=1, max_num=2,
        )
    formset = None
    if request.method == 'POST':
        if level_id:
            level = get_object_or_404(Level, pk=level_id)
            form = LevelForm(request.POST, instance=level)
            formset = CharactersFormSet(request.POST, request.FILES, instance=level)
        else:
            form = LevelForm(request.POST)
            
        if form.is_valid():
            form.save()
            formset = CharactersFormSet(request.POST, request.FILES, instance=form.instance)
            if formset.is_valid() :
                formset.save()
            return HttpResponseRedirect(reverse('maze:index'))
    
    else:
        if level_id :
            level = get_object_or_404(Level, pk=level_id)
            form = LevelForm(instance=level)
        else:
            form = LevelForm()            
            level = Level()
        formset = CharactersFormSet(instance=level)

    return render(request, 'level.html', {'form':form, 'formset':formset})

def char_preview(request, char_id):
    character = get_object_or_404(Character, pk=char_id)
    return render(request, 'character_preview.html', {
        'character': character,
        })
