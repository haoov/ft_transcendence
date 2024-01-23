import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { User } from 'src/user/user.interface';
import { clientEvents, serverEvents } from '../game/enum/events.enum';
import { UserService } from './user.service';
import { userStatus } from './enum/userStatus.enum';
import { Room } from 'src/game/classes/Room';
import { GameGateway } from 'src/game/game.gateway';
import { Inject, forwardRef } from '@nestjs/common';

// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'users' })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private usersSockets: Map<number, Socket[]>;
	
	constructor(	private readonly userService: UserService,
								@Inject(forwardRef(() => GameGateway)) private readonly gameGateway: GameGateway) {
		this.usersSockets = new Map<number, Socket[]>();
	}

	handleConnection(client: Socket) {
		client.on(clientEvents.connected, async (user: User) => {
			client.data.user = user;
			const socketIds: Socket[] = this.usersSockets.get(user.id);
			if (socketIds)
				socketIds.push(client);
			else
				this.usersSockets.set(user.id, [client]);
			const updatedUser = await this.userService.updateUserStatus(user, userStatus.online);
			this.dataChanged(updatedUser);
			console.log("user connection: " + user.username);
		});
	}

	async handleDisconnect(client: Socket) {
		if (client.data.user) {
			const socketIds: Socket[] = this.usersSockets.get(client.data.user.id);
			if (socketIds) {
				const index: number = socketIds.indexOf(client);
				if (index > -1)
					socketIds.splice(index, 1);
				if (socketIds.length == 0) {
					this.usersSockets.delete(client.data.user.id);
					await this.userService.updateUserStatus(client.data.user, userStatus.offline);
					this.dataChanged(client.data.user);
				}
				console.log("user disconnection: " + client.data.user.username);
			}
		}
	}

	@SubscribeMessage(clientEvents.gameInvite)
	async gameInvite(client: Socket, opponentID: number) {
		const opponent: User = await this.userService.getUserById(opponentID);
		const sockets: Socket[] = this.usersSockets.get(opponentID);
		if (sockets) {
			sockets.forEach(socket => {
				socket.emit(serverEvents.gameInvite, client.data.user);
			});
		}
	}

	gameReady(room: Room, user: User) {
		const sockets: Socket[] = this.usersSockets.get(room.getUsers()[0].id);
		if (sockets) {
			sockets.forEach(socket => {
				socket.emit(serverEvents.gameReady, user);
			});
		}
	}

	dataChanged(user: User) {
		this.usersSockets.forEach((sockets: Socket[], id: number) => {
			sockets.forEach(socket => {
				socket.emit(serverEvents.dataChanged, user);
			});
		});
	}

}