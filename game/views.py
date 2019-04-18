# game.views
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

from game.models import Game

# Create your views here.
@login_required
def room(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    return render(request, 'room.html', {
        'game': game,
        })
