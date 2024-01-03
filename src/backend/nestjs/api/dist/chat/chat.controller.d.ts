import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
import { Channel } from "./chat.interface";
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
}
export declare class ChatController {
    private readonly chatService;
    private readonly userService;
    constructor(chatService: ChatService, userService: UserService);
    getAllMessages(): Promise<Message[]>;
    getAllMessagesByChannel(idChannel: string): Promise<Message[]>;
    getAllChannels(): Promise<Channel[]>;
    getCurrentUserChannels(userId: string): Promise<Channel[]>;
}
export {};
