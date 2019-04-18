# coding : utf-8
# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from pprint import pprint
from django.shortcuts import render, get_object_or_404
from django.template.loader import render_to_string

from game.models import Game

class RoomsConsumer(WebsocketConsumer):
    def connect(self):
        # Join lobby
        async_to_sync(self.channel_layer.group_add)(
            "lobby",
            self.channel_name
        )        
        self.accept()
        
        # pour obtenir et renseigner la liste des parties ouvertes
        all_games = Game.objects.filter(is_over=False) # en cours
        games = [g for g in all_games if g.is_open()]  # et il reste des places
        html = render_to_string('chat/channel_list.html', {'games': games})
        async_to_sync(self.channel_layer.group_send)(
            "lobby",
            {
                'type': 'join.message',
                'message': html,
            }
        )
        
        self.send(text_data=json.dumps({
            'message': html,
        }))

    
    def disconnect(self, close_code):
        # Leave lobby
        async_to_sync(self.channel_layer.group_discard)(
            "lobby",
            self.channel_name
        )
    
    # Receive message from room group
    def join_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # game_id est aussi le nom du salon pour la partie
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        # on associe l'utilisateur django à ce channel
        self.user = self.scope['user']
        # ainsi que l'objet partie
        self.game = get_object_or_404(Game, pk=self.game_id)
        # le nombre de joueurs pour la partie
        self.max_players = self.game.level.character_set.count()
        # auquel on ajoute le joueur se connectant
        self.game.players.add(self.scope['user'])
        
        # Rejoint le salon de la partie en cours
        async_to_sync(self.channel_layer.group_add)(
            self.game_id,
            self.channel_name
        )

        # On notifie le lobby des parties restantes
        all_games = Game.objects.filter(is_over=False) # en cours
        games = [g for g in all_games if g.is_open()]  # où il reste des places
        html = render_to_string('chat/channel_list.html', {'games': games})
        async_to_sync(self.channel_layer.group_send)(
            "lobby",
            {
                'type': 'join.message',
                'message': html,
            }
        )
        
        # On accepte la connexion
        # mais avant, on récupère la position (futur index) du channel
        # dans le groupe. L'index futur est égal à la taille actuelle du
        # groupe. La position est donc celle où l'on joint la partie
        self.position = len(self.channel_layer.groups[self.game_id]) - 1
        # hack : on stocke la position dans la base de données, mais 
        # pour ne pas devoir étendre le modèle User, on utilise last_name
        self.user.last_name = self.position
        self.user.save()
        self.accept()

        print('CHANNEL LAYER GROUPS : ', self.channel_layer.groups)
        print('CHANNEL LAYER NAME : ', self.channel_name)
        print('POSITION : ', self.position)
        
        # Message de contrôle pour notifier la connection de l'utilisateur
        # et sa position dans le jeu au salon de la partie
        players_qs = self.game.players.all()
        players = [[p.last_name, p.username] for p in players_qs]
        async_to_sync(self.channel_layer.group_send)(
            self.game_id,
                {
                    'type': 'status.message',
                    'action': 'connection',
                    'user': self.user,
                    'position': self.position,
                    'max_players': self.max_players,
                    'players': players,
                }
            )


    def disconnect(self, close_code):
        self.game.is_over = True
        self.game.save()

        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.game_id,
            self.channel_name
        )
        
        # Notifie le lobby
        all_games = Game.objects.filter(is_over=False) # en cours
        games = [g for g in all_games if g.is_open()]  # et il reste des places
        html = render_to_string('chat/channel_list.html', {'games': games})
        async_to_sync(self.channel_layer.group_send)(
            "lobby",
            {
                'type': 'join.message',
                'message': html,
            }
        )
        
        # Envoie un message de contrôle au salon de la partie
        players_qs = self.game.players.all()
        players = [[p.last_name, p.username] for p in players_qs]
        async_to_sync(self.channel_layer.group_send)(
            self.game_id,
                {
                    'type': 'status.message',
                    'action': 'disconnection',
                    'user': self.user,
                    'position': self.position,
                    'max_players': self.max_players,
                    'players': players,
                }
            )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json['action'] == 'chat':
            message = self.scope['user'].username + ' : ' + text_data_json['message']
            async_to_sync(self.channel_layer.group_send)(
                self.game_id,
                    {
                        'type': 'chat.message', # méthode chat_message
                        'message': message,
                    }
                )
        
        if text_data_json['action'] == 'code':
            code = text_data_json['message']
            async_to_sync(self.channel_layer.group_send)(
                self.game_id,
                    {
                        'type': 'code.message', # méthode code_message
                        'message': code,
                        'position': self.position,
                    }
                )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'action': 'chat',
            'message': message
            })
        )
        
    def code_message(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'action': 'code',
            'message': event['message'],
            'position': event['position'],
            })
        )
    
    # notification de (dé)connection de la part d'un membre du groupe
    # de cette partie
    def status_message(self, event):
        action = event['action']
        if action == 'connection' or action == 'disconnection':
            # Send message to WebSocket
            print('PLAYERS : ', event['players'])
            self.send(text_data=json.dumps({
                'action': action,
                'user': event['user'].username, # string pour sérialiser
                'position': event['position'],
                'max_players': event['max_players'],
                'players': event['players'],
                })
            )
            
