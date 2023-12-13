import { ChatService } from "./chat.service";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getAllMessagesByChannel(): Promise<Message[]>;
}
