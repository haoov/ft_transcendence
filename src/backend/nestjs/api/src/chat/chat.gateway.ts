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

function buildMsg(sender, message) {
	return {
		sender: sender as UserEntity,
		message: {
			channelId : message.channelId,
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
	private listActiveChannel: Map<number, string> = new Map<number, string>();
	private usersSocketList : Map<number, Socket> = new Map<number, Socket>();

	handleConnection(socket: Socket) {
		let lastActiveChannel : string;
		socket.emit('NewConnection');
		socket.on('userConnected', async (user: any) => {
			this.usersSocketList.set(user.id, socket);
			const listChannel = await this.chatService.getCurrentUserChannels(user.id);
			for (const channel of listChannel) {
				socket.join(channel.id.toString());
			}
			lastActiveChannel = this.listActiveChannel.get(user.id);
			const id = lastActiveChannel ? lastActiveChannel.toString() : "0";
			socket.emit('lastActiveChannel', id);
		});
	}

	handleDisconnect(socket: Socket) {
		this.usersSocketList.forEach((value: Socket, key: number) => {
			if (value === socket) {
				this.usersSocketList.delete(key);
			}
		});
	}

	@SubscribeMessage('setActiveChannel')
	async onJoinCurrentChannel(@MessageBody() data: any) {
		const channelid = data.channelId;
		const userId = data.currentUserId;
		this.listActiveChannel.set(userId, channelid);
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() message: any) {
		const sender = await this.userService.getUserById(message.senderId);
		this.server.to(message.channelId.toString()).emit('newMessage', buildMsg(
			sender,
			message
		));
		this.chatService.createMessage(message);
	}

	@SubscribeMessage('createNewChannel')
	async onNewChannel(@MessageBody() channel: any) {
		const newChannelCreated = await this.chatService.createChannel(channel);
		for (const userId of channel.users) {
			this.usersSocketList.get(userId).join(newChannelCreated.id.toString());
			this.usersSocketList.get(userId).emit('newChannelCreated', newChannelCreated);
		}
	}

	@SubscribeMessage('joinChannel')
	async onJoinChannel(@MessageBody() channel: any) {
		const channelToJoin = await this.chatService.getChannelById(channel.channelId);
		if (channelToJoin.mode === 'Protected' && channelToJoin.password !== channel.password) {
			this.usersSocketList.get(channel.userId).emit('channelJoined', false);
			return;
		}
		if ( await this.chatService.addUserToChannel(channel.channelId, channel.userId)) {
			this.usersSocketList.get(channel.userId).emit('channelJoined', true);
			this.usersSocketList.get(channel.userId).emit('newChannelCreated', channelToJoin);
		}
	}

	@SubscribeMessage('leaveChannel')
	async onLeaveChannel(@MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		if (await this.chatService.removeUserFromChannel(channelId, userId)) {
			this.usersSocketList.get(userId).emit('channelDeleted', channelId);
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
			const socket = this.usersSocketList.get(userId);
			socket.emit('channelJoined', true);
			socket.emit('channelUpdated', channelId);
		}
	}

	@SubscribeMessage('blockUser')
	async onBlockUser(@MessageBody() data: Object) {
		const userId = data['userId'];
		const userToBlockId = data['userToBlockId'];
		try {
			await this.userService.blockUser(userId, userToBlockId);
		} catch (err) {
			throw err;
		}
	}

	@SubscribeMessage('unblockUser')
	async onUnblockUser(@MessageBody() data: Object) {
		const userId = data['userId'];
		const userToUnblockId = data['userToUnblockId'];
		try {
			await this.userService.unblockUser(userId, userToUnblockId);
		} catch (err) {
			throw err;
		}
	}

}