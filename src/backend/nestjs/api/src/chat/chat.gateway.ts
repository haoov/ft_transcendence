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

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private readonly userSockets: Map<number, Socket[]>;

	constructor(
		@InjectRepository(
			ChannelEntity) private channelRepository: Repository<ChannelEntity>,
			private readonly chatService: ChatService,) {
		this.userSockets = new Map<number, Socket[]>();
	}

	handleConnection(@ConnectedSocket() client: Socket) {}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		this.userSockets.delete(client.data.userId);
		if (!this.userSockets.has(client.data.userId)) {
			console.log("chat disconnection");
		}
	}
    
	@SubscribeMessage('joinChannel')
	async onJoinChannel(@MessageBody() channel: any) {
		const channelToJoin = await this.chatService.getChannelById(channel.channelId);
		const isMatch =  await bcrypt.compare(channel.password, channelToJoin.password);
		if (channelToJoin.mode === 'Protected' && !isMatch) {
			this.userSockets.get(channel.userId).forEach((s) => {s.emit('channelJoined', false)});
			return;
		}
		if ( await this.chatService.addUserToChannel(channel.channelId, channel.userId)) {
			this.userSockets.get(channel.userId).forEach((s) => {s.emit('channelJoined', true)});
			this.userSockets.get(channel.userId).forEach((s) => {s.emit('newChannelCreated', channelToJoin)});
			this.userSockets.get(channel.userId).forEach((s) => {s.join(channel.channelId.toString())});
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
		const message: Message = await this.chatService.createMessage(MessageDTO);
		const channel: Channel = await this.chatService.getChannelById(MessageDTO.channelId);
		this.server.to(channel.id.toString()).emit('newMessage', message);
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

	channelUpdate(channel: Channel): void {
		for (const user of channel.users) {
			const sockets: Socket[] = this.userSockets.get(user.id);
			if (sockets) {
				for (const socket of sockets)
					socket.emit('channelUpdated', channel);
			}
		}
	}
}