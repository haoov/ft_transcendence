import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { 
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';

function buildMsg(senderName, profilePic, message) {
	return {
		sender:{
			name: senderName,
			avatar: profilePic,
		},
		message: {
			text : message.text,
			time: message.timestamp,
		}
	}
};

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService
		) {}

	@WebSocketServer()
	server: Server;
	private usersSocketList : Map<number, Socket> = new Map<number, Socket>();

	onModuleInit() {
		this.server.on('connection', (socket: Socket) => {
			let currentChannel : string = null;

			socket.on('join', (channel: any ) => {
				if (currentChannel) {
					socket.leave(currentChannel);
				}
				socket.join(channel.id.toString());
				currentChannel = channel.id.toString();
			});
			this.server.emit('NewConnection');
			socket.on('userConnected', (user: any) => {
				this.usersSocketList.set(user.id, socket);
			});
		});
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

}