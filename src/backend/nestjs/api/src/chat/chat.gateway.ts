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

function buildMsg(senderName, message) {
	return {
		senderName: senderName,
		text : message.message,
		time: message.timestamp,
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
	onNewMessage(@MessageBody() message: any) {
		console.log(message);
		// const msg = buildMsg(message.senderName, message);
		const msg = message.messageText;
		this.server.emit('newMessage', { sender:"Aboulest", data: message });
	}
}