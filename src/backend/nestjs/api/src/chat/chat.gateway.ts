import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { 
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { ChannelEntity } from 'src/postgreSQL/entities';
import * as bcrypt from 'bcrypt';
import { Channel, Message } from './chat.interface';
import { User } from 'src/user/user.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDTO } from './dto/chat.dto';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private readonly userSockets: Map<number, Socket[]>;
	private listMutedUsers : Map<number, number[]>;

	constructor(
		@InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
		private readonly chatService: ChatService,
		private readonly userService: UserService) {
		this.userSockets = new Map<number, Socket[]>();
		this.listMutedUsers = new Map<number, number[]>();
	}

	handleConnection(@ConnectedSocket() client: Socket) {}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		this.userSockets.delete(client.data.userId);
	}

	@SubscribeMessage('joinChannel')
	async onJoinChannel(@MessageBody() channel: any) {
		const idChannel = channel.channelId;
		const idUser = channel.userId;
		const passwordChannel = channel.password;
		let channelToJoin = await this.chatService.getChannel(idChannel);
		let isMatch;
		if (channelToJoin.mode === 'Protected')
			isMatch =  await bcrypt.compare(passwordChannel, channelToJoin.password);
		else
			isMatch = true;
		if (channelToJoin.mode === 'Protected' && !isMatch) {
			this.userSockets.get(idUser).forEach((s) => {s.emit('errorManager', 'Wrong password')});
			return;
		}
		if (await this.chatService.addUserToChannel(idChannel, idUser)) {
			channelToJoin = await this.chatService.getChannel(idChannel);
			this.userSockets.get(channel.userId).forEach((s) => {s.join(channel.channelId.toString())});
			this.server.to(channel.channelId.toString()).emit('channelUpdated', channelToJoin);
		}
	}

	@SubscribeMessage('userConnected')
	async onUserConnected(@ConnectedSocket() client: Socket, @MessageBody() user: User) {
		client.data.userId = user.id;
		this.userSockets.set(user.id, [client]);
		const userChannels: Channel[] = await this.channelRepository.find({
			where: { users: { id: user.id } } 
		});
		if (userChannels) {
			for (const channel of userChannels) {
				client.join(channel.id.toString());
			}
		}
	}

	@SubscribeMessage('newMessage')
	async newMessage(@ConnectedSocket() client: Socket, @MessageBody() MessageDTO: MessageDTO) {
		const channel: Channel = await this.chatService.getChannel(MessageDTO.channelId);
    const muted = this.listMutedUsers.get(channel.id);
		const blocked: number[] = await this.userService.getBlockingList(MessageDTO.sender.id);
		if (muted && muted.includes(MessageDTO.sender.id)) {
			const sockets: Socket[] = this.userSockets.get(MessageDTO.sender.id);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('muted', channel);
				}
			}
			return;
		}
    const message: Message = await this.chatService.createMessage(MessageDTO);
		channel.users.forEach((user) => {
			const sockets: Socket[] = this.userSockets.get(user.id);
			if (sockets) {
				for (const socket of sockets) {
					if (!blocked.includes(user.id))
						socket.emit('newMessage', message);
				}
			}
		});
	}

	newChannel(channel: Channel): void {
		for (const user of channel.users) {
			const sockets: Socket[] = this.userSockets.get(user.id);
			if (sockets) {
				for (const socket of sockets) {
					socket.join(channel.id.toString());
					socket.emit('newChannelCreated', channel);
				}
			}
		}
	}

	channelUpdate(channel: Channel, users?: User[]): void {
		if (users) {
			for (const user of users) {
				const sockets: Socket[] = this.userSockets.get(user.id);
				if (sockets) {
					for (const socket of sockets) {
						socket.join(channel.id.toString());
					}
				}
			}
		}
		this.server.to(channel.id.toString()).emit('channelUpdated', channel);
	}

	async channelLeft(channelId: number, userId: number): Promise<void> {
		const sockets: Socket[] = this.userSockets.get(userId);
		if (sockets) {
			for (const socket of sockets) {
				socket.leave(channelId.toString());
			}
		}
		const channel: Channel = await this.chatService.getChannel(channelId);
		this.channelUpdate(channel);
	}

	@SubscribeMessage('setAdmin')
	async onSetAdmin(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		let channel: Channel = await this.chatService.getChannel(channelId);
		if (await this.chatService.isAlreadyAdmin(channelId, userId)) {
			client.emit('errorManager', 'User is already admin');
			return;
		}
		if (await this.chatService.setChannelAdmin(channelId, userId)) {
			channel = await this.chatService.getChannel(channelId);
			const sockets: Socket[] = this.userSockets.get(userId);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('namedAdmin', channel);
				}
			}
			this.channelUpdate(channel);
		}
	}

	channelDeleted(channelId: number): void {
		this.server.to(channelId.toString()).emit('channelDeleted', channelId);
	}

	@SubscribeMessage('kickUser')
	async onKickUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		let channel: Channel = await this.chatService.getChannel(channelId);
		if (await this.chatService.isAlreadyKicked(channelId, userId)) {
			client.emit('errorManager', 'User is already kicked');
			return;
		}
		if (await this.chatService.removeUserFromChannel(channelId, userId)) {
			channel = await this.chatService.getChannel(channelId);
			const sockets: Socket[] = this.userSockets.get(userId);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('kicked', channel);
					socket.leave(channelId.toString());
				}
			}
			this.channelUpdate(channel);
		}
	}

	@SubscribeMessage('banUser')
	async onBanUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		const channelId = data.channelId;
		const userId = data.userId;
		let channel: Channel = await this.chatService.getChannel(channelId);
		if (await this.chatService.isAlreadyBanned(channelId, userId)) {
			client.emit('errorManager', 'User is already banned');
			return;
		}
		if (await this.chatService.banUserFromChannel(channelId, userId)) {
			channel = await this.chatService.getChannel(channelId);
			const sockets: Socket[] = this.userSockets.get(userId);
			if (sockets) {
				for (const socket of sockets) {
					socket.emit('banned', channel);
					socket.leave(channelId.toString());
				}
			}
			this.channelUpdate(channel);
		}
	}

	@SubscribeMessage('muteUser')
	async onMuteUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
		try {
			const channelId = data.channelId;
			const userId = data.userId;
			const channel: Channel = await this.chatService.getChannel(channelId);
		
			let mutedUsers = this.listMutedUsers.get(channelId);
			if (!mutedUsers) {
			  mutedUsers = [];
			}
			if (!mutedUsers.includes(userId)) {
				mutedUsers.push(userId);
				this.listMutedUsers.set(channelId, mutedUsers);
				const sockets: Socket[] = this.userSockets.get(userId);
				if (sockets) {
					for (const socket of sockets) {
						socket.emit('muted', channel);
					}
				}
				setTimeout(() => {
					mutedUsers = this.listMutedUsers.get(channelId).filter(id => id != userId);
					this.listMutedUsers.set(channelId, mutedUsers);
				}, 15 * 60 * 1000); // 15 minutes en millisecondes
			}
			else {
				client.emit('errorManager', 'User is already muted');
			}
		  } catch (error) {
				throw error;
		  }
	}

	async sendError(id: number, error: string) {
		const sockets: Socket[] = this.userSockets.get(id);
		for (const socket of this.userSockets.values()) {
			socket.forEach((s) => {s.emit('errorManager', error)});
		}
	}
}