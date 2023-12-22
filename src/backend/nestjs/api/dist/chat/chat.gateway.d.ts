import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
export declare class ChatGateway implements OnModuleInit {
    private readonly chatService;
    private readonly userService;
    constructor(chatService: ChatService, userService: UserService);
    server: Server;
    onModuleInit(): void;
    onNewMessage(message: any): Promise<void>;
    onNewChannel(channel: any): Promise<void>;
}
