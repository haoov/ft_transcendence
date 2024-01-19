import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { User } from 'src/user/user.interface';
import { clientEvents, serverEvents } from '../game/enum';
import { UserService } from './user.service';
import { userStatus } from './enum/userStatus.enum';
import { Room } from 'src/game/classes';
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
			await this.userService.updateUserStatus(user, userStatus.online);
			console.log("user connection: " + user.username);
		});
	}

	handleDisconnect(client: Socket) {
		if (client.data.user) {
			const socketIds: Socket[] = this.usersSockets.get(client.data.user.id);
			if (socketIds) {
				const index: number = socketIds.indexOf(client);
				if (index > -1)
					socketIds.splice(index, 1);
				if (socketIds.length == 0) {
					this.usersSockets.delete(client.data.user.id);
					this.userService.updateUserStatus(client.data.user, userStatus.offline);
				}
				console.log("user disconnection: " + client.data.user.username);
			}
		}
	}

	gameReady(room: Room) {
		const sockets: Socket[] = this.usersSockets.get(room.getUsers()[0].id);
		if (sockets) {
			sockets.forEach(socket => {
				socket.emit(serverEvents.gameReady);
			});
			console.log("notification gameReady sent to user: " + room.getUsers()[0].id);
		}
	}

	disableNotifications(users: User[]) {
		users.forEach((user) => {
			const sockets: Socket[] = this.usersSockets.get(user.id);
			if (sockets) {
				sockets.forEach(socket => {
					socket.emit(serverEvents.disableNotifications);
				});
			}
		})
	}

}