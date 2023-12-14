import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('/:idChannel')
	async getAllMessagesByChannel(): Promise<Message []> {
		const idChannel = parseInt('idChannel');
		return await this.chatService.getAllMessagesByChannel(idChannel);
	}

}