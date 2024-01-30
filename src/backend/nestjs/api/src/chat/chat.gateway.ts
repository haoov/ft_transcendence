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


// 	// @SubscribeMessage('createNewChannel')
// 	// async onNewChannel(@MessageBody() channel: any) {
// 	// 	const newChannelCreated = await this.chatService.createChannel(channel);
// 	// 	for (const userId of channel.users) {
// 	// 		const socket = this.usersSocketList.get(userId);
// 	// 		socket?.join(newChannelCreated.id.toString());
// 	// 		socket?.emit('newChannelCreated', newChannelCreated);
// 	// 	}
// 	// }

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

	@WebSocketServer() 
	server: Server;
	private readonly userSockets: Map<number, Socket[]>;
	private listMutedUsers : Map<number, number[]>;

	constructor(
		@InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
		 private readonly chatService: ChatService,) {
		this.userSockets = new Map<number, Socket[]>();
		this.listMutedUsers = new Map<number, number[]>();
	}

	handleConnection(@ConnectedSocket() client: Socket) {
		console.log("chat connection");
	}

	@SubscribeMessage('joinChannel')
	async onJoinChannel(@MessageBody() channel: any) {
		const idChannel = channel.channelId;
		const idUser = channel.userId;
		const passwordChannel = channel.password;
		const channelToJoin = await this.chatService.getChannelById(idChannel);
		let isMatch;
		if (channelToJoin.mode === 'Protected')
			isMatch =  await bcrypt.compare(passwordChannel, channelToJoin.password);
		else
			isMatch = true;
		if (channelToJoin.mode === 'Protected' && !isMatch) {
			this.userSockets.get(idUser).forEach((s) => {s.emit('channelJoined', {
				channel: channelToJoin,
				passCheck: false,
			})});
			return;
		}
		if (await this.chatService.addUserToChannel(idChannel, idUser)) {

			this.userSockets.get(channel.userId).forEach((s) => {s.emit('channelJoined', {
				channel: channelToJoin,
				passCheck:true,
			})});
			// this.userSockets.get(channel.userId).forEach((s) => {s.emit('newChannelCreated', channelToJoin)});
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
		// Check if user is muted
		const muted = this.listMutedUsers.get(channel.id);
		if (muted && muted.includes(message.sender.id)) {
			const sockets: Socket[] = this.userSockets.get(message.sender.id);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('muted', channel);
				}
			}
			return;
		}
		for (const user of channel.users) {
			this.server.to(channel.id.toString()).emit('newMessage', message);
		}
	}

	@SubscribeMessage('setAdmin')
	async onSetAdmin(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		const channel: Channel = await this.chatService.getChannelById(channelId);
		if (await this.chatService.isAlreadyAdmin(channelId, userId)) {
			client.emit('errorManager', 'User is already admin');
			return;
		}
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
	async onKickUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		const channel: Channel = await this.chatService.getChannelById(channelId);
		if (await this.chatService.isAlreadyKicked(channelId, userId)) {
			client.emit('errorManager', 'User is already kicked');
			return;
		}
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
		if (await this.chatService.isAlreadyBanned(channelId, userId)) {
			client.emit('errorManager', 'User is already banned');
			return;
		}
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

	@SubscribeMessage('muteUser')
	async onMuteUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		try {
			const channelId = data.channelId;
			const userId = data.userId;
			const channel: Channel = await this.chatService.getChannelById(channelId);
		
			let mutedUsers = this.listMutedUsers.get(channelId);
			if (!mutedUsers) {
			  mutedUsers = [];
			}
			if (!mutedUsers.includes(userId)) {
				mutedUsers.push(userId);
				this.listMutedUsers.set(channelId, mutedUsers);
				const sockets: Socket[] = this.userSockets.get(userId);
				if (sockets) {
					for (const socket of sockets) {
						socket.emit('muted', channel);
					}
				}
				setTimeout(() => {
					mutedUsers = this.listMutedUsers.get(channelId).filter(id => id != userId);
					this.listMutedUsers.set(channelId, mutedUsers);
				}, 15 * 60 * 1000); // 15 minutes en millisecondes
			}
			else {
				client.emit('errorManager', 'User is already muted');
			}
		  } catch (error) {
				throw error;
		  }
	}
}