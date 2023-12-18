import { ChatService } from "./chat.service";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getAllMessages(): Promise<Message[]>;
    getAllMessagesByChannel(): Promise<Message[]>;
    getAllChannels(): Promise<Channel[]>;
}
