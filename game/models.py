# game.models
from django.db import models
from django.contrib.auth.models import User

from maze.models import Level

# Create your models here.
class Game(models.Model):
    name = models.CharField('nom', max_length=20)
    players = models.ManyToManyField(User)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    is_over = models.BooleanField('terminé', default=False)
    
    def is_open(self):
        return self.players.count() < self.level.character_set.count()
    
    class Meta:
      ordering = ['name']
    
    def __str__(self):
        return self.name

