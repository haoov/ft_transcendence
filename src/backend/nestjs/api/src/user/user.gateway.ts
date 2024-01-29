import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
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
	
	constructor(private readonly userService: UserService) {
		this.usersSockets = new Map<number, Socket[]>();
	}

	handleConnection() {}

	@SubscribeMessage('userConnected')
	async onUserConnected(@ConnectedSocket() client: Socket, @MessageBody() user: User) {
		client.data.user = user;
		const socketIds: Socket[] = this.usersSockets.get(user.id);
		if (socketIds)
			socketIds.push(client);
		else
			this.usersSockets.set(user.id, [client]);
		const updatedUser = await this.userService.updateUserStatus(user, userStatus.online);
		this.dataChanged(updatedUser);
		console.log("user connection: " + user.username);
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
		const sockets: Socket[] = this.usersSockets.get(opponentID);
		if (sockets) {
			sockets.forEach(socket => {
				socket.emit(serverEvents.gameInvite, client.data.user);
			});
		}
	}

	@SubscribeMessage(clientEvents.gameResponse)
	gameResponse(client: Socket, response: {accepted: boolean, opponent: User}) {
		const sockets: Socket[] = this.usersSockets.get(response.opponent.id);
		if (sockets) {
			if (!response.accepted) {
				sockets.forEach((socket) => {
					socket.emit(serverEvents.gameResponse, {accepted: false, opponent: client.data.user});
				})
			}
		}
	}

	@SubscribeMessage(clientEvents.addFriend)
	addFriend(client: Socket, friendID: number) {
		const sockets: Socket[] = this.usersSockets.get(friendID);
		if (sockets) {
			sockets.forEach(socket => {
				socket.emit(serverEvents.addFriend, client.data.user);
			});
		}
	}

	@SubscribeMessage(clientEvents.friendResponse)
	friendResponse(client: Socket, response: {accepted: boolean, opponent: User}) {
		const sockets: Socket[] = this.usersSockets.get(response.opponent.id);
		if (sockets) {
			if (response.accepted) {
				sockets.forEach((socket) => {
					socket.emit(serverEvents.friendResponse, {accepted: true, opponent: client.data.user});
				})
			}
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