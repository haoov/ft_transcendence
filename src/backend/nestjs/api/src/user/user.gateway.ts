import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway} from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { User } from 'src/user/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../postgreSQL/entities/user.entity';
import { userStatus } from './enum/userStatus.enum';
import { clientEvents } from '../game/enum';

// DRAFT : ne fonctionne pas bien 

// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'users' })
export class UserGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {
	
	constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {
	}

	handleConnection(client: Socket) {
		console.log("userSocket connected");
	}

	handleDisconnect(client: Socket) {
		console.log("userSocket disconnected");
	}

}