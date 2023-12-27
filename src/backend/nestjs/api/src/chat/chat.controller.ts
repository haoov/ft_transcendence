import { Controller, Get, Post, Param } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
import { UserEntity } from "src/postgreSQL/entities/user.entity";


interface Message {
	id: number;
	sender: {
		name: string;
		avatar: string;
	};
	message: {
		text: string;
		time: string;
	};
};

function convertRawMessagesToMessages(messagesRaw: MessageRaw [], users: UserEntity []) : Message [] {
	let messages: Message [] = [];
	for (const message of messagesRaw) {
		const user = users.find((user) => { return user.id === message.senderId });
		let messageConverted: Message = {
			id: message.id,
			sender: {
				name: user?.username as string,
				avatar: user?.avatar as string,
			},
			message: {
				text: message.text,
				time: message.timestamp,
			}
		};
		messages.push(messageConverted);
	}
	return messages;
}

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService
		) {}

	@Get('/messages')
	async getAllMessages(): Promise<Message []> {
		const users = await this.userService.getAllUsers();
		const messagesRaw = await this.chatService.getAllMessages();
		const messages = convertRawMessagesToMessages(messagesRaw, users as UserEntity []);
		return messages;
	}

	@Get('messages/:idChannel')
	async getAllMessagesByChannel(@Param('idChannel') idChannel: string): Promise<Message []> {
		const users = await this.userService.getAllUsers();
		const messagesRaw = await this.chatService.getAllMessagesByChannel(parseInt(idChannel));
		const messages = convertRawMessagesToMessages(messagesRaw, users as UserEntity []);
		return messages;
	}

	@Get('/Channels')
	async getAllChannels(): Promise<Channel []> {
		return await this.chatService.getAllChannels();
	}

	@Get('/Channels/:id')
	async getChannelById(@Param('id') id: string): Promise<Channel> {
		return await this.chatService.getChannelById(parseInt(id));
	}

	// @Post('/Channels')
	// async createChannel(): Promise<Channel> {
	// 	return await this.chatService.createChannel();
	// }
}