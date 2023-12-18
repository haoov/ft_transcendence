import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { GameGatewayService } from './game.gateway.service';
import { ClientEvents } from './enum';
import { User } from 'src/user/user.interface';
import { Room } from './classes/Room';
import { UserService } from 'src/user/user.service';


// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'game' })
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {

	// On declare le serveur et les variables
	@WebSocketServer() server: Server;
	rooms: Room[]
	waiting: Socket[];

	constructor(private gameGtwService: GameGatewayService, private readonly userService: UserService) {
		this.rooms = [];
		this.waiting = [];
	}

	handleConnection(client: Socket) {
		client.on(ClientEvents.connected, (data: User) => {
			client.data.user = data;
			this.gameGtwService.handleUserConnection(
				client, 
				this.rooms, 
				this.waiting, 
				this.server);
		});
	}

	handleDisconnect(client: Socket) {
		this.gameGtwService.handleUserDisconnection(
			client,
			this.rooms, 
			this.waiting,
			this.server
		)
	}

	// les messages (events) qu'on recoit du client
	@SubscribeMessage('move')
	moveDot(client: Socket, data: string){
		this.gameGtwService.moveDot(client, data, this.rooms, this.server, this.waiting);
	}
}
