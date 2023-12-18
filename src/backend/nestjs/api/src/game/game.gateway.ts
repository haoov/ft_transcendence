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
	classic_rooms: Room[]
	classic_waiting: Socket[];
	super_rooms: Room[]
	super_waiting: Socket[];

	constructor(private gameGtwService: GameGatewayService, private readonly userService: UserService) {
		this.classic_rooms = [];
		this.classic_waiting = [];
		this.super_rooms = [];
		this.super_waiting = [];
	}

	handleConnection(client: Socket) {
		client.on(ClientEvents.connected, (data: User) => {
			client.data.user = data;
		});
	}

	handleDisconnect(client: Socket) {
		if (client.data.mode === "classic")
			this.gameGtwService.handleUserDisconnection(
											client,
											this.classic_rooms,
											this.classic_waiting,
											this.server);
		else if (client.data.mode === "super")
			this.gameGtwService.handleUserDisconnection(
											client,
											this.super_rooms,
											this.super_waiting,
											this.server);
	}

	@SubscribeMessage('mode')
	assignMode(client: Socket, data: string) {
		this.gameGtwService.assignMode(client,
										data,
										this.classic_rooms,
										this.classic_waiting,
										this.super_rooms,
										this.super_waiting,
										this.server)
	}

	@SubscribeMessage('update')
	update(client: Socket) {
		let room: Room;
		if (client.data.mode === "classic") {
			room = this.classic_rooms.find((currentRoom) => {return (currentRoom.getName() == client.data.room);})
		}
		else {
			room = this.super_rooms.find((currentRoom) => {return (currentRoom.getName() == client.data.room);})
		}
		if (room) {
			this.server.to(room.getName()).emit("updated", room.getGame().update());
		}
	}

	@SubscribeMessage('move')
	moveDot(client: Socket, data: string){
		if (client.data.mode === "classic")
			this.gameGtwService.move(client, data, this.classic_rooms);
		else if (client.data.mode === "super")
			this.gameGtwService.move(client, data, this.super_rooms);
	}
}
