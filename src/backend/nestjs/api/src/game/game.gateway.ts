import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { GameGatewayService } from './game.gateway.service';
import { ClientEvents } from './enum';
import { User } from 'src/user/user.interface';
import { Room } from './classes/Room';
import { UserService } from 'src/user/user.service';
import { UserStatus } from 'src/user/enum/userStatus.enum';


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
	assignMode(client: Socket, params : string[]) {
		this.gameGtwService.assignMode(client,
										params,
										this.classic_rooms,
										this.classic_waiting,
										this.super_rooms,
										this.super_waiting,
										this.server)
	}

	@SubscribeMessage('update')
	update(client: Socket) {
		let room: Room;
		if (client.data.mode === "classic")
			room = this.gameGtwService.findRoom(client, this.classic_rooms);
		else
			room = this.gameGtwService.findRoom(client, this.super_rooms);
		if (room) {
			let update = room.getGame().update();
			this.server.to(room.getName()).emit("updated", update);
			if (update.finished && client.data.mode === "classic")
				this.gameGtwService.finishGame(room, this.classic_rooms, this.server);
			else if (update.finished && client.data.mode === "super")
				this.gameGtwService.finishGame(room, this.super_rooms, this.server);
		}
	}
	
	@SubscribeMessage('move')
	move(client: Socket, data: string){
		if (client.data.mode === "classic")
			this.gameGtwService.move(client, data, this.classic_rooms);
		else if (client.data.mode === "super")
			this.gameGtwService.move(client, data, this.super_rooms);
	}

	@SubscribeMessage('stop_wait')
	async stopWaiting(client: Socket) {
		if (client.data.mode === "classic")
			this.classic_waiting.length = 0;
		else if (client.data.mode === "super")
			this.super_waiting.length = 0;
		await this.userService.updateUserStatus(client.data.user, UserStatus.undefined);
		this.gameGtwService.resetSocket(client);

	}
}
