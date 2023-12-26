import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
interface Message {
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
    getChannelById(id: string): Promise<Channel>;
}
export {};
