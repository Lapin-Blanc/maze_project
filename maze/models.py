# maze.models
from django.db import models
from django.urls import reverse

# Create your models here.
class Block(models.Model):
    name = models.CharField('nom', max_length=50)
    
    def __str__(self):
        return self.name

class Pixel(models.Model):
    name = models.CharField('nom', max_length=20)
    sprite = models.ImageField('fichier sprites', upload_to='sprites/')
    downIndex = models.IntegerField('index direction bas', default=8)
    clockWise = models.BooleanField('rotation horaire', default = True)
    nbHPix = models.IntegerField('sprites horizontaux', default = 16)
    nbVPix = models.IntegerField('sprites verticaux', default = 1)
    
    def __str__(self):
        return self.name


class Character(models.Model):
    name = models.CharField('nom', max_length=20)
    posX = models.IntegerField('position horizontale', default=0)
    posY = models.IntegerField('position verticale', default=0)
    direction = models.CharField('direction', max_length = 5,
        choices = (('up','haut'),('right','droite'),('down','bas'),('left','gauche')),
        default='down')
    pixel = models.ForeignKey(Pixel, verbose_name='pixels', on_delete=models.CASCADE, null=True)
    niveau = models.ForeignKey('Level', on_delete=models.CASCADE)
    
    def get_absolute_url(self):
        return reverse('maze:char_preview', kwargs={'char_id': self.id})
    
    def __str__(self):
        return self.name


class Level(models.Model):
    name = models.CharField('nom', max_length=50)
    lvl_map = models.TextField('carte', default=
        '''[
        ["I","H","H","H","H","H","H","H","H","I"],
        ["I","_","_","_","_","_","_","_","_","I"],
        ["I","_","_","_","_","_","_","_","_","I"],
        ["I","_","_","_","_","_","_","_","_","I"],
        ["I","_","_","_","_","_","_","_","_","I"],
        ["I","_","_","_","_","_","_","_","_","I"],
        ["I","_","_","_","_","_","_","_","_","I"],
        ["I","_","_","_","_","_","_","_","_","I"],
        ["I","_","_","_","_","_","_","_","_","I"],
        ["I","I","I","I","I","I","I","I","I","I"]]'''
        )
    maxBlocks = models.IntegerField('nombre max de blocs', default=0)
    blocks = models.ManyToManyField(Block, verbose_name='blocs disponibles')
    
    class Meta:
        verbose_name_plural = 'niveaux'
    
    def get_absolute_url(self):
        return reverse('maze:edit', kwargs={'level_id': self.id})
    
    def __str__(self):
        return self.name
