# chat.views
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from chat.forms import GameForm

# Create your views here.
@login_required
def index(request):
    if request.method == "POST":
        form = GameForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(
                reverse('game:room',
                    kwargs={'game_id':form.instance.id})
                )
    form = GameForm()
    return render(request, 'chat/index.html', {'form':form})
