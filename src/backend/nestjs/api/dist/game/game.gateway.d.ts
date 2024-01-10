import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/user.interface';
import { Room } from './classes/Room';
import { UserService } from 'src/user/user.service';
import { gameParams } from './interfaces/gameParams';
import { GameService } from './game.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly userService;
    private readonly gameService;
    server: Server;
    rooms: Room[];
    roomId: number;
    constructor(userService: UserService, gameService: GameService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): Promise<void>;
    manageRooms(client: Socket, params: gameParams): Promise<void>;
    update(client: Socket): void;
    move(client: Socket, direction: string): void;
    stopWaiting(client: Socket): Promise<void>;
    findRoom(client: Socket): Room;
    createRoom(params: gameParams, p1: User): Room;
    closeRoom(room: Room): void;
    deleteRoom(room: Room): void;
}
