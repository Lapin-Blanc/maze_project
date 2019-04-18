# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from pprint import pprint
from django.shortcuts import render
from django.template.loader import render_to_string

from .models import Clients

class RoomsConsumer(WebsocketConsumer):
    def connect(self):
        # Join lobby
        async_to_sync(self.channel_layer.group_add)(
            "lobby",
            self.channel_name
        )
        pprint(self.channel_layer.groups)
        self.accept()
        
        # groups = "\n".join([e for e in list(self.channel_layer.groups)])
        groups = [e for e, v in list(self.channel_layer.groups.items()) if len(v)==1 and e!='lobby']
        html = render_to_string('chat/channel_list.html', {'groups': groups})
        
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
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.level_id = self.scope['url_route']['kwargs']['level_id']
        self.room_group_name = '%s' % self.room_name
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        # Send message to room group
        # groups = "\n".join([e for e,v in list(self.channel_layer.groups.items())])
        groups = [e for e, v in list(self.channel_layer.groups.items()) if len(v)==1 and e!='lobby']
        html = render_to_string('chat/channel_list.html', {'groups': groups})
        
        async_to_sync(self.channel_layer.group_send)(
            "lobby",
            {
                'type': 'join.message',
                'message': html,
            }
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        # Leave lobby
        async_to_sync(self.channel_layer.group_discard)(
            "lobby",
            self.channel_name
        )
        # Send message to room group
        # groups = "\n".join([e for e in list(self.channel_layer.groups)])
        groups = [e for e, v in list(self.channel_layer.groups.items()) if len(v)==1 and e!='lobby']
        html = render_to_string('chat/channel_list.html', {'groups': groups})
        
        async_to_sync(self.channel_layer.group_send)(
            "lobby",
            {
                'type': 'join.message',
                'message': html,
            }
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = self.scope['user'].username + ' : ' + text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat.message',
                'message': message,
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
