import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
export declare class GameGateway implements OnModuleInit {
    position: {
        x: number;
        y: number;
    };
    server: Server;
    onModuleInit(): void;
    moveDot(client: Socket, data: any): void;
}
