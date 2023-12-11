import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { UserEntity } from 'src/postgreSQL/entities/user.entity';

// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'game' })
export class GameGateway {

    player: number;

    position = {
        p1: {
            x: 300,
            y: 200
        },
        p2: {
            x: 100,
            y: 200
        },
    }

  // On declare le serveur
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(client.id);
    console.log("Connection established");
	client.on("connected", (data) => {client.data.user = data});
  }

  handleDisconnect(client: Socket) {

  }

  // les messages (events) qu'on recoit du client
  @SubscribeMessage('move')
  moveDot(client: Socket, data: string){
    console.log(client.data);
    // on envoie la position au client
    client.emit("position", this.position)
	switch(data) {
	case "left":
		(client.data.user.id % 2) ? this.position.p1.x -= 5 : this.position.p2.x -= 5;
		// on envoie la position au server
		this.server.emit("position", this.position);
		break;
	case "right":
		(client.data.user.id % 2) ? this.position.p1.x += 5 : this.position.p2.x += 5;
		this.server.emit("position", this.position);
		break;
	case "up":
		(client.data.user.id % 2) ? this.position.p1.y -= 5 : this.position.p2.y -= 5;
		this.server.emit("position", this.position);
		break;
	case "down":
		(client.data.user.id % 2) ? this.position.p1.y += 5 : this.position.p2.y += 5;
		this.server.emit("position", this.position);
		break;
  }
  }
}
