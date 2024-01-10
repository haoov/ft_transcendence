import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { UserEntity } from '../postgreSQL/entities/user.entity';
export declare class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private usersRepository;
    clients: Socket[];
    constructor(usersRepository: Repository<UserEntity>);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
}
