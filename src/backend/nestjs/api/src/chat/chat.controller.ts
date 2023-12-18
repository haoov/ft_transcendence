import { Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('/messages')
	async getAllMessages(): Promise<Message []> {
		return await this.chatService.getAllMessages();
	}

	@Get('message/:idChannel')
	async getAllMessagesByChannel(): Promise<Message []> {
		const idChannel = parseInt('idChannel');
		return await this.chatService.getAllMessagesByChannel(idChannel);
	}

	@Get('/Channels')
	async getAllChannels(): Promise<Channel []> {
		return await this.chatService.getAllChannels();
	}

	// @Post('/Channels')
	// async createChannel(): Promise<Channel> {
	// 	return await this.chatService.createChannel();
	// }
}