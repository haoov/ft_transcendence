import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { 
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { ChannelEntity, UserEntity } from 'src/postgreSQL/entities';
import * as bcrypt from 'bcrypt';
import { Channel, Message } from './chat.interface';
import { User } from 'src/user/user.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// function buildMsg(sender, message) {
// 	return {
// 		sender: sender as UserEntity,
// 		message: {
// 			id: message.id,
// 			channelId : message.channelId,
// 			text : message.text,
// 			time: message.datestamp,
// 		}
// 	}
// };

// @WebSocketGateway({ namespace: 'chat' })
// export class ChatGateway implements OnGatewayConnection {
// 	constructor(
// 		private readonly chatService: ChatService,
// 		private readonly userService: UserService
// 		) {}

// 	@WebSocketServer()
// 	server: Server;
// 	private listActiveChannel: Map<number, string> = new Map<number, string>();
// 	private usersSocketList : Map<number, Socket> = new Map<number, Socket>();

// 	handleConnection(socket: Socket) {
// 		let lastActiveChannel : string;
// 		//socket.emit('NewConnection');
// 		socket.on('userConnected', async (user: any) => {
// 			this.usersSocketList.set(user.id, socket);
// 			const listChannel = await this.chatService.getCurrentUserChannels(user.id);
// 			for (const channel of listChannel) {
// 				socket.join(channel.id.toString());
// 			}
// 			lastActiveChannel = this.listActiveChannel.get(user.id);
// 			const id = lastActiveChannel ? lastActiveChannel.toString() : "0";
// 			socket.emit('lastActiveChannel', id);
// 		});
// 	}

// 	handleDisconnect(socket: Socket) {
// 		this.usersSocketList.forEach((value: Socket, key: number) => {
// 			if (value === socket) {
// 				this.usersSocketList.delete(key);
// 			}
// 		});
// 	}

// 	@SubscribeMessage('setActiveChannel')
// 	async onJoinCurrentChannel(@MessageBody() data: any) {
// 		const channelid = data.channelId;
// 		const userId = data.currentUserId;
// 		this.listActiveChannel.set(userId, channelid);
// 	}

// 	@SubscribeMessage('newMessage')
// 	async onNewMessage(@MessageBody() message: any) {
// 		const sender = await this.userService.getUserById(message.senderId);
// 		const msg = await this.chatService.createMessage(message);
// 		this.server.to(message.channelId.toString()).emit('newMessage', buildMsg(
// 			sender,
// 			msg
// 		));
// 	}

// 	// @SubscribeMessage('createNewChannel')
// 	// async onNewChannel(@MessageBody() channel: any) {
// 	// 	const newChannelCreated = await this.chatService.createChannel(channel);
// 	// 	for (const userId of channel.users) {
// 	// 		const socket = this.usersSocketList.get(userId);
// 	// 		socket?.join(newChannelCreated.id.toString());
// 	// 		socket?.emit('newChannelCreated', newChannelCreated);
// 	// 	}
// 	// }

// 	@SubscribeMessage('joinChannel')
// 	async onJoinChannel(@MessageBody() channel: any) {
// 		const channelToJoin = await this.chatService.getChannelById(channel.channelId);
// 		if (channelToJoin.mode === 'Protected' && channelToJoin.password !== channel.password) {
// 			this.usersSocketList.get(channel.userId)?.emit('channelJoined', false);
// 			return;
// 		}
// 		if ( await this.chatService.addUserToChannel(channel.channelId, channel.userId)) {
// 			this.usersSocketList.get(channel.userId)?.emit('channelJoined', true);
// 			this.usersSocketList.get(channel.userId)?.emit('newChannelCreated', channelToJoin);
// 			this.usersSocketList.get(channel.userId)?.join(channel.channelId.toString());
// 		}
// 	}

// 	@SubscribeMessage('leaveChannel')
// 	async onLeaveChannel(@MessageBody() data: any) {
// 		const channelId = data.channelId;
// 		const userId = data.userId;
// 		if (await this.chatService.removeUserFromChannel(channelId, userId)) {
// 			this.usersSocketList.get(userId)?.emit('channelDeleted', channelId);
// 		}
// 	}

// 	@SubscribeMessage('updateChannel')
// 	async onUpdateChannel(@MessageBody() channel: any) {
// 		const channelToUpdate = await this.chatService.getChannelById(channel.channelId);
// 		channelToUpdate.name = channel.name;
// 		channelToUpdate.mode = channel.mode;
// 		channelToUpdate.password = channel.password;
// 		const channelUpdated = await this.chatService.updateChannel(channelToUpdate);
// 		const users = await this.chatService.getUsersByChannelId(channel.channelId);
// 		for (const user of users) {
// 			this.usersSocketList.get(user.id)?.emit('channelUpdated', channelUpdated);
// 		}
// 	}

// 	@SubscribeMessage('deleteChannel')
// 	async onDeleteChannel(@MessageBody() channelId: number) {
// 		const users = await this.chatService.getUsersByChannelId(channelId);
// 		if (await this.chatService.deleteChannel(channelId)) {
// 			for (const user of users) {
// 				this.usersSocketList.get(user.id)?.emit('channelDeleted', channelId);
// 			}
// 		}
// 	}

// 	@SubscribeMessage('addUserToChannel')
// 	async onAddUserToChannel(@MessageBody() data: Object ) {
// 		const channelId = data['channelId'];
// 		const users = data['users'];
// 		const userIdList = users.map((user) => user.id);
// 		const channelToUpdate = await this.chatService.getChannelById(channelId);
// 		for (const userId of userIdList) {
// 			await this.chatService.addUserToChannel(channelToUpdate.id, userId);
// 			const socket = this.usersSocketList.get(userId);
// 			socket?.emit('channelJoined', true);
// 			socket?.emit('channelUpdated', channelId);
// 		}
// 	}


	/*----------------------------------------------------------------------------*/
	/*                                      RAPH                                  */
	/*----------------------------------------------------------------------------*/

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection {

	@WebSocketServer() server: Server;
	private readonly userSockets: Map<number, Socket[]>;

	constructor(
		@InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
		 private readonly chatService: ChatService,) {
		this.userSockets = new Map<number, Socket[]>();
	}

	handleConnection(@ConnectedSocket() client: Socket) {
		console.log("chat connection");
    }
    
	@SubscribeMessage('joinChannel')
	async onJoinChannel(@MessageBody() channel: any) {
		const channelToJoin = await this.chatService.getChannelById(channel.channelId);
		const isMatch =  await bcrypt.compare(channel.password, channelToJoin.password);
		if (channelToJoin.mode === 'Protected' && !isMatch) {
			this.userSockets.get(channel.userId).forEach((s) => {s.emit('channelJoined', false)});
			return;
		}
		if ( await this.chatService.addUserToChannel(channel.channelId, channel.userId)) {
			this.userSockets.get(channel.userId).forEach((s) => {s.emit('channelJoined', true)});
			this.userSockets.get(channel.userId).forEach((s) => {s.emit('newChannelCreated', channelToJoin)});
			this.userSockets.get(channel.userId).forEach((s) => {s.join(channel.channelId.toString())});
		}
	}

	@SubscribeMessage('userConnected')
	async onUserConnected(@ConnectedSocket() client: Socket, @MessageBody() user: User) {
		client.data.userId = user.id;
		this.userSockets.set(user.id, [client]);
		const userChannels: Channel[] = await this.channelRepository.find({
			where: {
				users: { id: user.id }
			} 
		});
		if (userChannels) {
			for (const channel of userChannels) {
				client.join(channel.id.toString());
			}
		}
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		this.userSockets.delete(client.data.userId);
		if (!this.userSockets.has(client.data.userId)) {
			console.log("chat disconnection");
		}
	}

	newChannel(channel: Channel): void {
		for (const user of channel.users) {
			const sockets: Socket[] = this.userSockets.get(user.id);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('newChannelCreated', channel);
				}
			}
		}
	}

	channelUpdate(channel: Channel): void {
		for (const user of channel.users) {
			const sockets: Socket[] = this.userSockets.get(user.id);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('channelUpdated', channel);
				}
			}
		}
	
	}

	newMessage(message: Message, channel: Channel): void {
		for (const user of channel.users) {
			// const sockets: Socket[] = this.userSockets.get(user.id);
			// if (sockets) {
			// 	for (const socket of sockets) {
			// 		socket.emit('newMessage', message);
			// 	}
			// }
			this.server.to(channel.id.toString()).emit('newMessage', message);
		}
	}

	@SubscribeMessage('setAdmin')
	async onSetAdmin(@MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		const channel: Channel = await this.chatService.getChannelById(channelId);
		if (await this.chatService.setChannelAdmin(channelId, userId)) {
			const sockets: Socket[] = this.userSockets.get(userId);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('namedAdmin', channel);
				}
			}
			this.server.to(channelId.toString()).emit('channelUpdated', channel);
		}
	}

	@SubscribeMessage('kickUser')
	async onKickUser(@MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		const channel: Channel = await this.chatService.getChannelById(channelId);
		if (await this.chatService.removeUserFromChannel(channelId, userId)) {
			const sockets: Socket[] = this.userSockets.get(userId);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('kicked', channel);
					socket.leave(channelId.toString());
				}
			}
			this.server.to(channelId.toString()).emit('channelUpdated', channel);
		}
	}

	@SubscribeMessage('banUser')
	async onBanUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		const channel: Channel = await this.chatService.getChannelById(channelId);
		if (await this.chatService.banUserFromChannel(channelId, userId)) {
			const sockets: Socket[] = this.userSockets.get(userId);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('banned', channel);
					socket.leave(channelId.toString());
				}
			}
			this.server.to(channelId.toString()).emit('channelUpdated', channel);
		}
	}

}