import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'

// Outil de gestion des web socket events
@WebSocketGateway()
export class GameGateway implements OnModuleInit {

  // On declare le serveur
  @WebSocketServer()
  server: Server

  onModuleInit() {
      this.server.on('connection', (socket) => {
          console.log(socket.id);
          console.log("Connection established");
      })
  }

  // les messages qu'on recoit du client
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body:any) {
    console.log(body);
    // on envoie un message au client
    this.server.emit('onMessage', {
      msg: 'newMessage',
      content: body,
    });
  }
}
