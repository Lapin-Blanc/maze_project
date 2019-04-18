from django.contrib import admin
from .models import Character, Level, Block

# Register your models here.
class CharacterInline(admin.TabularInline):
    model = Character
    extra = 2
    min_num = 1
    max_num = 2
    
class LevelAdmin(admin.ModelAdmin):
    model = Level
    exclude = []
    inlines = [CharacterInline]
    filter_horizontal = ['blocks',]
    
admin.site.register(Character)
admin.site.register(Level, LevelAdmin)
admin.site.register(Block)
