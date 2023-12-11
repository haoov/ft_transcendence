import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
export declare class ChatGateway implements OnModuleInit {
    private readonly chatService;
    private readonly userService;
    constructor(chatService: ChatService, userService: UserService);
    server: Server;
    onModuleInit(): void;
    onNewMessage(data: Message): Promise<void>;
    onJoinchannel(socket: Socket, data: any): Promise<void>;
    onLeavechannel(socket: Socket, data: any): void;
    onCreateChannel(socket: Socket, data: any): Promise<void>;
    onEditChannel(socket: Socket, data: any): Promise<void>;
    onDeleteChannel(socket: Socket, data: any): Promise<void>;
}
