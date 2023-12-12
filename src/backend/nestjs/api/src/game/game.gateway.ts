import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { GameGatewayService } from './game.gateway.service';
import { ClientEvents, PlayerSide, PlayerStatus } from './enum';


// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'game' })
export class GameGateway {

	// On declare le serveur et les variables
	@WebSocketServer() server: Server;
	players: Socket[];
	waiting: Socket[];

	constructor(private gameGtwService: GameGatewayService) {
		this.players = [];
		this.waiting = [];
	}

	handleConnection(client: Socket) {
		client.on(ClientEvents.connected, (data) => {
			client.data.user = data;
			client.data.status = PlayerStatus.undefined;
			client.data.side = PlayerSide.undefined;
		});
		this.gameGtwService.handleUserConnection(
			client, 
			this.players, 
			this.waiting, 
			this.server);
	}

	handleDisconnect(client: Socket) {

	}

	// les messages (events) qu'on recoit du client
	@SubscribeMessage('move')
	moveDot(client: Socket, data: string){
		console.log("move done");
		this.gameGtwService.moveDot(client, data, this.players, this.server);
	}
}
