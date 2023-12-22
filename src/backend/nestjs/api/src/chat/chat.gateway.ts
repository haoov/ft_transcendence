import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { 
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

	onModuleInit() {
		this.server.on('connection', (socket: Socket) => {
		});
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() message: any) {
		const sender = await this.userService.getUserById(message.senderId);
		this.server.emit('newMessage', buildMsg(
			sender.username,
			sender.avatar,
			message
		));
		this.chatService.createMessage(message);
	}

	@SubscribeMessage('newChannel')
	async onNewChannel(@MessageBody() channel: any) {
		console.log(channel);
		this.chatService.createChannel(channel);
	}

}