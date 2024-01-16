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
import { ChannelEntity } from 'src/postgreSQL/entities';

function buildMsg(senderName, profilePic, message) {
	return {
		sender:{
			name: senderName,
			avatar: profilePic,
		},
		message: {
			text : message.text,
			time: message.datestamp,
		}
	}
};

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection {
	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService
		) {}

	@WebSocketServer()
	server: Server;
	private listCurrentActiveChannel: Map<number, ChannelEntity> = new Map<number, ChannelEntity>();
	private usersSocketList : Map<number, Socket> = new Map<number, Socket>();

	handleConnection(socket: Socket) {
		this.server.emit('NewConnection');
		socket.on('userConnected', (user: any) => {
			this.usersSocketList.set(user.id, socket);
		});
	}

	handleDisconnect(socket: Socket) {
		this.usersSocketList.forEach((value: Socket, key: number) => {
			if (value === socket) {
				this.usersSocketList.delete(key);
			}
		});
	}

	@SubscribeMessage('JoinCurrentChannel')
	async onJoinCurrentChannel(@MessageBody() data: any) {
		const channel = data.channel;
		const userId = data.userId;
		const socket = this.usersSocketList.get(userId);
		let currentChannel = this.listCurrentActiveChannel.get(userId);
		if (currentChannel) {
			socket.leave(currentChannel.id.toString());
		}
		this.listCurrentActiveChannel.set(userId, channel);
		socket.join(channel.id.toString());
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() message: any) {
		const sender = await this.userService.getUserById(message.senderId);
		this.server.to(message.channelId.toString()).emit('newMessage', buildMsg(
			sender.username,
			sender.avatar,
			message
		));
		this.chatService.createMessage(message);
	}

	@SubscribeMessage('createNewChannel')
	async onNewChannel(@MessageBody() channel: any) {
		const newChannelCreated = await this.chatService.createChannel(channel);
		for (const userId of channel.users) {
			this.usersSocketList.get(userId).emit('newChannelCreated', newChannelCreated);
		}
	}

	@SubscribeMessage('joinChannel')
	async onJoinChannel(@MessageBody() channel: any) {
		const channelToJoin = await this.chatService.getChannelById(channel.id);
		if (channelToJoin.mode === 'Protected' && channelToJoin.password !== channel.password) {
			this.usersSocketList.get(channel.userId).emit('channelJoined', false);
			return;
		}
		if ( await this.chatService.addUserToChannel(channel.channelId, channel.userId)) {
			this.usersSocketList.get(channel.userId).emit('channelJoined', true);
			this.usersSocketList.get(channel.userId).emit('newChannelCreated', channelToJoin);
		}
	}

	@SubscribeMessage('updateChannel')
	async onUpdateChannel(@MessageBody() channel: any) {
		const channelToUpdate = await this.chatService.getChannelById(channel.channelId);
		channelToUpdate.name = channel.name;
		channelToUpdate.mode = channel.mode;
		channelToUpdate.password = channel.password;
		const channelUpdated = await this.chatService.updateChannel(channelToUpdate);
		const users = await this.chatService.getUsersByChannelId(channel.channelId);
		for (const user of users) {
			this.usersSocketList.get(user.id).emit('channelUpdated', channelUpdated);
		}
	}

	@SubscribeMessage('deleteChannel')
	async onDeleteChannel(@MessageBody() channelId: number) {
		const users = await this.chatService.getUsersByChannelId(channelId);
		if (await this.chatService.deleteChannel(channelId)) {
			for (const user of users) {
				this.usersSocketList.get(user.id).emit('channelDeleted', channelId);
			}
		}
	}

	@SubscribeMessage('addUserToChannel')
	async onAddUserToChannel(@MessageBody() data: Object ) {
		const channelId = data['channelId'];
		const users = data['users'];
		const userIdList = users.map((user) => user.id);
		const channelToUpdate = await this.chatService.getChannelById(channelId);
		for (const userId of userIdList) {
			await this.chatService.addUserToChannel(channelToUpdate.id, userId);
			this.usersSocketList.get(userId).emit('channelJoined', true);
			this.usersSocketList.get(userId).emit('channelUpdated', channelId);
		}
	}
}