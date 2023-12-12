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

const ADMIN_NAME = 'Admin'; //Peut etre inutile 

function buildMsg(senderName, message) {
	return {
		senderName: senderName,
		text : message.message,
		time: message.timestamp,
	}
};

@WebSocketGateway()
export class ChatGateway {
	// constructor(
	// 	private readonly chatService: ChatService,
	// 	private readonly userService: UserService
	// 	) {}

	// @WebSocketServer()
	// server: Server;

	// onModuleInit() {
	// 	this.server.on('connection', (socket: Socket) => {
	// 	console.log('New connection');
	// 	});
	// }

	// @SubscribeMessage('newMessage')
	// async onNewMessage(@MessageBody() data: Message) {
	// 	const message = {
	// 		senderId: data.senderId,
	// 		channelId: data.channelId,
	// 		message: data.message,
	// 		datestamp: new Date(),
	// 		timestamp: Date.now(),
	// 	};
	// 	const sender = await this.userService.getUserById(data.senderId);
	// 	const messageCreated = await this.chatService.createMessage(message);
	// 	this.server.emit('onMessage', buildMsg(sender.username, messageCreated));
	// }

	// @SubscribeMessage('joinchannel')
	// async onJoinchannel(socket: Socket, data: any) {
	// 	socket.join(data.channelId);
	// 	const messages = await this.chatService.getAllMessagesByChannel(data.channelId);
	// 	for (const message of messages) {
	// 		const sender = await this.userService.getUserById(message.senderId);
	// 		socket.emit('message', buildMsg(sender.username, message));
	// 	}
	// }

	// //Diff a faire entre changer de channel et quitter le channel
	// @SubscribeMessage('leavechannel')
	// onLeavechannel(socket: Socket, data: any) {
	// 	socket.leave(data.channelId);
	// }

	// @SubscribeMessage('createChannel')
	// async onCreateChannel(socket: Socket, data: any) {
	// 	const channel = {
	// 		name: data.name,
	// 		creatorId: data.creatorId,
	// 		modeChanel: data.modeChanel,
	// 	};
	// 	const channelCreated = await this.chatService.createChannel(channel);
	// }

	// @SubscribeMessage('editChannel')
	// async onEditChannel(socket: Socket, data: any) {
	// 	const channel = {
	// 		name: data.name,
	// 		modeChanel: data.modeChanel,
	// 	};
	// 	const channelEdited = await this.chatService.saveChannel(data.editorId, data.channelId, channel);
	// }

	// @SubscribeMessage('deleteChannel')
	// async onDeleteChannel(socket: Socket, data: any) {
	// 	const channelDeleted = await this.chatService.deleteChannel(data.channelId, data.userId);
	// }
}