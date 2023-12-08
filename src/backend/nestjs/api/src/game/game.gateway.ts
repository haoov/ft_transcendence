import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

// Outil de gestion des web socket events
@WebSocketGateway()
export class GameGateway implements OnModuleInit {

  position = {
      x: 200,
      y: 200,
  };

  // On declare le serveur
  @WebSocketServer()
  server: Server;

  onModuleInit() {
      this.server.on('connection', (socket) => {
          console.log(socket.id);
          console.log("Connection established");
      })
  }

  // les messages (events) qu'on recoit du client
  @SubscribeMessage('move')
  moveDot(client: Socket, data: any) {
    console.log("Mouvement du client");
    // on envoie la position au client
    client.emit("position", this.position)
    switch(data) {
      case "left":
          this.position.x -= 5;
          // on envoie la position au server
          this.server.emit("position", this.position);
          break;
      case "right":
          this.position.x += 5;
          this.server.emit("position", this.position);
          break;
      case "up":
          this.position.y -= 5;
          this.server.emit("position", this.position);
          break;
      case "down":
          this.position.y += 5;
          this.server.emit("position", this.position);
          break;
  }
  }
}
