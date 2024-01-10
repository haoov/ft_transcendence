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
@WebSocketGateway({ namespace: 'connect' })
export class UserGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {
	
	clients: Socket[];

	constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {
		this.clients = [];
	}

	// Set the user as 'online' 
	async handleConnection(client: Socket) {
		client.on(clientEvents.connected, async (data: User) => {
			client.data.user = data;
			this.clients.push(client);
			try {
				const user: User = await this.usersRepository.findOneBy({ email: data.email });
				if (user.status === userStatus.undefined || user.status === userStatus.offline) {
					user.status = userStatus.online;
					await this.usersRepository.save(user);
					//console.log("status on active pour " + user.username);
				}
			}
			catch (err) {
				throw err;
			};
		});
	}

	// Set the user as 'offline'
	async handleDisconnect(client: Socket) {
		try {
			if (client.data.user) {	
				// Check if several windows opened
				const windows: Socket[] = this.clients.filter((socket) => socket.data.id === client.data.id);
				if (windows.length === 1) {
					// Updating status
					const user: User = await this.usersRepository.findOneBy({ email: client.data.user.email });
					user.status = userStatus.offline;
					await this.usersRepository.save(user);
					//console.log("status on offline pour " + user.username);
				}
			}
			// Remove from array
			for(let i: number = 0; i < this.clients.length; i++) {
				if (this.clients[i] === client) {
					this.clients.splice(i, 1);
					break;
				}
			}
		}
		catch (err) {
			throw err;
		};
	}

}