import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { GameGatewayService } from './game.gateway.service';
import { ClientEvents, PlayerSide } from './enum';
import { User } from 'src/user/user.interface';
import { UserStatus } from 'src/user/enum/userStatus.enum';
import { Room } from './classes/Room';


// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'game' })
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {

	// On declare le serveur et les variables
	@WebSocketServer() server: Server;
	rooms: Room[]
	waiting: Socket[];

	constructor(private gameGtwService: GameGatewayService) {
		this.rooms = [];
		this.waiting = [];
	}

	handleConnection(client: Socket) {
		client.on(ClientEvents.connected, (data: User) => {
			client.data.user = data;
			// client.data.status = UserStatus.undefined;
			// client.data.side = PlayerSide.undefined;
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
			this.players, 
			this.waiting,
			this.server
		)
	}

	// les messages (events) qu'on recoit du client
	@SubscribeMessage('move')
	moveDot(client: Socket, data: string){
		this.gameGtwService.moveDot(client, data, this.players, this.server);
	}
}
