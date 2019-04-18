# game.models
from django.db import models
from django.contrib.auth.models import User

from maze.models import Level

# Create your models here.
class Game(models.Model):
    name = models.SlugField('nom')
    players = models.ManyToManyField(User)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    is_over = models.BooleanField('terminé', default=False)
    
    def is_open(self):
        return self.players.count() < self.level.character_set.count()
    
    def __str__(self):
        return self.name

