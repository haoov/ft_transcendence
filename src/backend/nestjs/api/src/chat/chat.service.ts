import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity , ChannelEntity} from 'src/postgreSQL/entities/chat.entity';
import { UserEntity } from 'src/postgreSQL/entities/user.entity';
import { MessageRaw, Channel } from './chat.interface';
import { User } from 'src/user/user.interface';
import * as bcrypt from 'bcrypt';


async function encod(pw: string) : Promise<string> {
	const saltOrRounds = 10;
	const hash = await bcrypt.hash(pw, saltOrRounds);
	return hash;
}

async function createChannelObj(channel: any, users: User [], admins : User []) : Promise<ChannelEntity> {
	const newChannel = new ChannelEntity();
	newChannel.name = channel.name;
	newChannel.creatorId = channel.creatorId;
	newChannel.mode = channel.mode;
	newChannel.password = await encod(channel.password);
	newChannel.users = users;
	newChannel.admins = admins;
	return newChannel;
}

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(MessageEntity) private messagesRepository: Repository<MessageEntity>,
		@InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
		) {}

	/* MESSAGE */

	//Fetch all messages
	async getAllMessages(): Promise<MessageRaw []> {
		try {
			return await this.messagesRepository.find() as MessageRaw [];
		} catch (err) {
			throw err;
		}
	}
	
	//Fetch all messages by channel id
	async getAllMessagesByChannel(channelId: number): Promise<MessageRaw []> {
		try {
			const messages = await this.messagesRepository.find({ where: { channelId: channelId }});
			return messages as MessageRaw [];
		} catch (err) {
			throw err;
		}
	}

	//Fetch all messages by channel id
	async createMessage(message: MessageRaw): Promise<MessageRaw> {
		try {
			this.messagesRepository.create(message as MessageEntity);
			return await this.messagesRepository.save(message);
		} catch (err) {
			throw err;
		}
	}

	// /* CHANNEL */

	//Fetch all channels
	async getAllChannels(): Promise<Channel []> {
		try {
			return await this.channelRepository.find() as Channel [];
		} catch (err) {
			throw err;
		}
	}

	//Fetch user all channels by user id
	async getCurrentUserChannels(userId: number): Promise<Channel []> {
		try {
			return await this.channelRepository
			.createQueryBuilder("channel")
			.innerJoinAndSelect("channel.users", "user", "user.id = :userId", { userId })
			.getMany();
		} catch (err) {
			throw err;
		}
	}

	//Fetch channel by id
	async getChannelById(channelId: number): Promise<Channel> {
		try {
			return await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		} catch (err) {
			throw err;
		}
	}

	//Fetch users From channel by channel id
	async getUsersByChannelId(channelId: number): Promise<User []> {
		try {
			const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
			return channel.users;
		} catch (err) {
			throw err;
		}
	}

	//Fetch banned users From channel by channel id
	async getBannedUsersByChannelId(channelId: number): Promise<User []> {
		try {
			const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["bannedUsers"]});
			return channel.bannedUsers;
		} catch (err) {
			throw err ;
		}
	}

	//Fetch admins From channel by channel id
	async getAdminsByChannelId(channelId: number): Promise<User []> {
		try {
			const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["admins"]});
			return channel.admins;
		} catch (err){
			throw err;
		}
	}

	//Get all joinable channels (meaning not private or secret and not already joined by the user)
	async getJoinableChannels(userId: number): Promise<Channel []> {
		try {
			let channels: Channel [] = [];
			const alreadyJoinedChannels = await this.channelRepository
			.createQueryBuilder("channel")
			.innerJoin("channel.users", "user", "user.id = :userId", { userId })
			.getMany();
			const bannedChannels = await this.channelRepository
			.createQueryBuilder("channel")
			.innerJoin("channel.bannedUsers", "user", "user.id = :userId", { userId })
			.getMany();
			const nbchannelsJoined = alreadyJoinedChannels.length;
			const nbchannelsBanned = bannedChannels.length;
			if (nbchannelsJoined === 0 && nbchannelsBanned === 0) {
				channels = await this.channelRepository
				.createQueryBuilder("channel")
				.leftJoinAndSelect("channel.users", "user")
				.where("channel.mode IN (:...modes)", { modes: ['Public', 'Protected'] })
				.getMany();
			} else if (nbchannelsJoined > 0 && nbchannelsBanned === 0) {
				channels = await this.channelRepository
				.createQueryBuilder("channel")
				.leftJoinAndSelect("channel.users", "user")
				.where("channel.mode IN (:...modes)", { modes: ['Public', 'Protected'] })
				.andWhere("channel.id NOT IN (:...alreadyJoinedChannelIds)", { alreadyJoinedChannelIds: alreadyJoinedChannels.map(channel => channel.id) })
				.getMany();
			} else if (nbchannelsBanned === 0 && nbchannelsJoined > 0) {
				channels = await this.channelRepository
				.createQueryBuilder("channel")
				.leftJoinAndSelect("channel.users", "user")
				.where("channel.mode IN (:...modes)", { modes: ['Public', 'Protected'] })
				.andWhere("channel.id NOT IN (:...alreadyJoinedChannelIds)", { alreadyJoinedChannelIds: alreadyJoinedChannels.map(channel => channel.id) })
				.getMany();
			} else if (nbchannelsBanned > 0 && nbchannelsJoined > 0) {
				channels = await this.channelRepository
				.createQueryBuilder("channel")
				.leftJoinAndSelect("channel.users", "user")
				.where("channel.mode IN (:...modes)", { modes: ['Public', 'Protected'] })
				.andWhere("channel.id NOT IN (:...alreadyJoinedChannelIds)", { alreadyJoinedChannelIds: alreadyJoinedChannels.map(channel => channel.id) })
				.andWhere("channel.id NOT IN (:...bannedChannelIds)", { bannedChannelIds: bannedChannels.map(channel => channel.id) })
				.getMany();
			}
			return channels;
		} catch (err) {
			throw err;
		}
	}

	//Create a channel in the database
	async createChannel(channel: any): Promise<Channel> {
		try {
			let channelsExisted = await this.getAllChannels();
			if (channel.mode != "Secret" && channelsExisted.find((channelTried) => channelTried.name == channel.name)) {
				throw new ForbiddenException("Channel already exists")
			}
			const admins : User [] = [];
			admins.push(await this.userRepository.findOneBy({ id: channel.creatorId }) as User);
			const users : User [] = [];
			for (const idUser of channel.users) {
				const newUser = await this.userRepository.findOneBy({ id: idUser }) as User;
				users.push(newUser);
			}
			const newChannel : ChannelEntity = await createChannelObj(channel, users, admins);
			this.channelRepository.create(newChannel);
			return await this.channelRepository.save(newChannel) as Channel;
		} catch (err) {
			throw new ForbiddenException(err);
		}
	}

	// Update a channel in the database
	async updateChannel(channel: Channel): Promise<Channel> {
		try {
			const newChannel = await this.channelRepository.findOne({ where: { id: channel.id }, relations: ["users"]});
			newChannel.name = channel.name;
			newChannel.creatorId = channel.creatorId;
			newChannel.mode = channel.mode;
			newChannel.password = channel.password;
			await this.channelRepository.save(newChannel);
			return newChannel;
		} catch (err) {
			throw err;
		}
	}

	//Add a user to a channel
	async addUserToChannel(channelId: number, userId: number): Promise<boolean> {
		try {
			const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
			const user = await this.userRepository.findOne({ where: { id: userId }}) as User;
			channel.users.push(user);
			await this.channelRepository.save(channel);
			return true;
		} catch (err) {
			throw err;
		}
	}

	//Delete a user from a channel (kick)
	async removeUserFromChannel(channelId: number, userId: number): Promise<boolean> {
		try {
			const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
			let channelUsers = channel.users;
			const index = channelUsers.findIndex((user: User) => user.id == userId);
			if (index < 0) {
				return ;
			}
			channelUsers.splice(index, 1);
			channel.users = channelUsers;
			await this.channelRepository.save(channel);
			return true;
		} catch (err) {
			throw err;
		}
	}

	//Delete a channel
	async deleteChannel(channelId: number): Promise<boolean> {
		try {
			const messages = await this.messagesRepository.find({ where: { channelId: channelId }});
			await this.messagesRepository.remove(messages);
			const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
			await this.channelRepository.remove(channel);
			return true;
		} catch (err) {
			throw err;
		}
	}

	//Add an admin to a channel
	async addAdminToChannel(channelId: number, userId: number): Promise<boolean> {
		try {
			const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["admins"]});
			const user = await this.userRepository.findOne({ where: { id: userId }}) as User;
			channel.admins.push(user);
			await this.channelRepository.save(channel);
			return true;
		}
		catch (err) {
			throw err;
		}
	}

	//Ban a user from a channel
	async banUserFromChannel(channelId: number, userId: number): Promise<boolean> {
		try {
			const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["bannedUsers"]});
			const user = await this.userRepository.findOne({ where: { id: userId }}) as User;
			channel.bannedUsers.push(user);
			await this.channelRepository.save(channel);
			this.removeUserFromChannel(channelId, userId);
			return true;
		} catch (err) {
			throw err;
		}
	}
}