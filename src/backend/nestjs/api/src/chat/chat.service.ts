import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { MessageEntity , ChannelEntity} from 'src/postgreSQL/entities/chat.entity';
import { UserEntity } from 'src/postgreSQL/entities/user.entity';
import { Channel, Message } from './chat.interface';
import * as bcrypt from 'bcrypt';
import { User, UserRelation } from 'src/user/user.interface';
import { ChannelDTO, MessageDTO } from './dto/chat.dto';
import { lastValueFrom } from 'rxjs';


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

	//Permet de recuperer les channels qui ne sont ni prives ni secret et qui ne sont pas deja dans la liste des channels de l'utilisateur
	// async getJoinableChannels(userId: number): Promise<Channel []> {
	// 	let channels: Channel [] = [];
	// 	const alreadyJoinedChannels = await this.channelRepository
	// 	.createQueryBuilder("channel")
	// 	.innerJoin("channel.users", "user", "user.id = :userId", { userId })
	// 	.getMany();
	// 	if (alreadyJoinedChannels.length === 0) {
	// 		channels = await this.channelRepository
	// 		.createQueryBuilder("channel")
	// 		.leftJoin("channel.users", "user")
	// 		.where("channel.mode IN (:...modes)", { modes: ['Public', 'Protected'] })
	// 		.andWhere("user.id != :userId", { userId })
	// 		.getMany();
	// 	} else {
	// 		channels = await this.channelRepository
	// 		.createQueryBuilder("channel")
	// 		.where("channel.mode IN (:...modes)", { modes: ['Public', 'Protected'] })
	// 		.andWhere("channel.id NOT IN (:...alreadyJoinedChannelIds)", { alreadyJoinedChannelIds: alreadyJoinedChannels.map(channel => channel.id) })
	// 		.getMany();
	// 	}
	// 	return channels;
	// }

	//Permet de créer un channel dans la base de données
	// async createChannel(channel: any): Promise<Channel> {
	// 	const users : User [] = [];
	// 	for (const idUser of channel.users) {
	// 		const newUser = await this.userRepository.findOneBy({ id: idUser }) as User;
	// 		users.push(newUser);
	// 	}
	// 	const newChannel : ChannelEntity = createChannelObj(channel, users);
	// 	this.channelRepository.create(newChannel);
	// 	return await this.channelRepository.save(newChannel) as Channel;
	// }

	//Permet de mettre à jour un channel
	// async updateChannel(channel: Channel): Promise<Channel> {
	// 	const newChannel = await this.channelRepository.findOne({ where: { id: channel.id }, relations: ["users"]});
	// 	newChannel.name = channel.name;
	// 	newChannel.creatorId = channel.creatorId;
	// 	newChannel.mode = channel.mode;
	// 	newChannel.password = channel.password;
	// 	await this.channelRepository.save(newChannel);
	// 	return newChannel;
	// }

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
			const channel = await this.channelRepository.findOneOrFail({ where: { id: channelId }, relations: ["users"]});
			let channelUsers = channel.users;
			const index = channelUsers.findIndex((user: User) => user.id == userId);
			if (index < 0) {
				return false;
			}
			channelUsers.splice(index, 1);
			channel.users = channelUsers;
			await this.channelRepository.save(channel);
			return true;
		} catch (err) {
			throw err;
		}
	}

	// //Delete a channel
	// async deleteChannel(channelId: number): Promise<boolean> {
	// 	try {
	// 		const messages = await this.messagesRepository.find({ where: { channelId: channelId }});
	// 		await this.messagesRepository.remove(messages);
	// 		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
	// 		await this.channelRepository.remove(channel);
	// 		return true;
	// 	} catch (err) {
	// 		throw err;
	// 	}
	// }

	/*----------------------------------------------------------------------------*/
	/*                                      RAPH                                  */
	/*----------------------------------------------------------------------------*/

	async getChannel(channelId: number): Promise<Channel> {
		let channel: Channel;
		try {
			const channels: Channel[] = await this.channelRepository.createQueryBuilder("channel")
			.leftJoinAndSelect("channel.users", "users")
			.leftJoinAndSelect("channel.admins", "admins")
			.leftJoinAndSelect("channel.bannedUsers", "bannedUsers")
			.leftJoinAndSelect("channel.messages", "message")
			.leftJoinAndSelect("message.sender", "sender").getMany();
			channel = channels.find((c) => c.id == channelId);
		}
		catch (err) {
			console.log(err);
		}
		return channel;
	}

	async getJoinableChannels(userId: number): Promise<Channel[]> {
		let channels: Channel[];
		channels = await this.channelRepository.createQueryBuilder("channel")
		.leftJoinAndSelect("channel.users", "users")
		.leftJoinAndSelect("channel.bannedUsers", "bannedUsers").getMany();
		channels = channels.filter((c) => {
			if (
				c.mode == "Private" ||
				c.mode == "Secret" ||
				c.users.find((u) => u.id == userId) ||
				c.bannedUsers.find((u) => u.id == userId)
			) return false;
			else return true;
		});
		return channels;
	}

	async getAddableUsers(channelId: number, userId: number): Promise<User[]> {
		let users: User[] = await this.userRepository.find({
      relations: ["users_blocked"]
    });
		const currentUser: User = await this.userRepository.findOneOrFail({
			where: { id: userId },
			relations: ["users_blocked"]
		});
		if (channelId) {
			const channels: Channel[] = await this.channelRepository.createQueryBuilder("channel")
			.leftJoinAndSelect("channel.users", "users")
			.leftJoinAndSelect("channel.bannedUsers", "bannedUsers").getMany();
			const channel = channels.find((c) => c.id == channelId);
			users = users.filter((u) => {
				if (
					channel.bannedUsers.find(bu => bu.id == u.id) ||
					currentUser.users_blocked.find(ub => ub.id == u.id) ||
					channel.users.find(cu => cu.id == u.id) ||
					u.users_blocked.find(ub => ub.id == currentUser.id) ||
					u.id == userId
				) return false;
				else return true;
			});
			console.log(users);
		}
		else {
			users = users.filter((u) => {
				if (
					currentUser.users_blocked.find((b_user) => b_user.id == u.id) ||
					u.id == userId
				) return false;
				else return true;
			});
		}
		return users;
	}

	async createChannel(channelDTO: ChannelDTO): Promise<Channel> {
		let newChannel: Channel;
		const channels: Channel[] = await this.channelRepository.find();
		if (channelDTO.mode != "Secret") {
			if (await this.channelRepository.findOne({
				where: { name: channelDTO.name }
			})) throw new ForbiddenException("Channel name already taken");
		}
		newChannel = await this.channelRepository.save(channelDTO);
		return newChannel;
	}

	async updateChannel(channelId: number, channelDTO: ChannelDTO): Promise<Channel> {
		let updatedChannel: Channel;
		const channel: Channel = await this.getChannel(channelId);
		updatedChannel = await this.channelRepository.save({
			...channel,
			...channelDTO
		});
		return updatedChannel;
	}

	async deleteChannel(channelId: number, userId: number): Promise<void> {
		const channel: Channel = await this.channelRepository.createQueryBuilder("channel")
		.where("channel.id = :channelId", { channelId })
		.leftJoinAndSelect("channel.admins", "admins").getOne();
		if (channel.admins.find((a) => a.id == userId)) {
			await this.channelRepository.remove(channel);
		}
		else throw new ForbiddenException("You must be administrator");
	}

	async getUserChannels(userId: number): Promise<Channel[]> {
		let channels: Channel[];
		channels = await this.channelRepository.createQueryBuilder("channel")
		.leftJoinAndSelect("channel.users", "user")
		.leftJoinAndSelect("channel.messages", "message")
		.leftJoinAndSelect("message.sender", "sender")
		.getMany();
		this.sortCahnnels(channels);
		channels = channels.filter((c) => 
			c.users.find((u) => u.id == userId)
		);
		return channels;
	}

	async createMessage(messageDTO: MessageDTO): Promise<Message> {
		let newMessage: Message;
		const channel: Channel = await this.getChannel(messageDTO.channelId);
		newMessage = await this.messagesRepository.save(messageDTO);
		channel.messages.push(newMessage);
		await this.channelRepository.save(channel);
		return newMessage;
	}

	sortCahnnels(channels: Channel[]): Channel[] {
		return channels.sort((a, b) => {
			const aTime = new Date(a.messages[a.messages.length - 1]?.datestamp).getTime();
			const bTime = new Date(b.messages[b.messages.length - 1]?.datestamp).getTime();
			if (!aTime)
				return 1;
			else if (!bTime)
				return -1;
			else
				return bTime - aTime;
		})
	}

	async getChannelUsers(userId: number, channelId: number): Promise<UserRelation[]> {
		const currentUser: User = await this.userRepository.findOneOrFail({
			where: { id: userId },
			relations: [
				"friends",
				"users_blocked",
			]
		})
		const channel: Channel = await this.channelRepository.findOneOrFail({
			where: { id: channelId },
			relations: ["users"]
		});
		const userRelations: UserRelation[] = channel.users.map(
			(user) => {
				let friend: boolean | string = false;
				if (currentUser.friends.includes(user))
					friend = true;
				else if (user.friends.includes(currentUser))
					friend = 'pending';
				const userRelation: UserRelation = {
					id: user.id,
					username: user.username,
					avatar: user.avatar,
					status: user.status,
					blocking: user.users_blocked.includes(currentUser),
					blocked: currentUser.users_blocked.includes(user),
					friend: friend,
				}
				return userRelation;
			});
		return userRelations;
	}

	async isAlreadyAdmin(channelId: number, userId: number) {
		const channel: Channel = await this.channelRepository.findOneOrFail({
			where: { id: channelId },
			relations: ["admins"]
		});
		return channel.admins.find((u) => u.id == userId);
	}
	
		async isAlreadyKicked(channelId: number, userId: number) {
			const channel: Channel = await this.channelRepository.findOneOrFail({
				where: { id: channelId },
				relations: ["users"]
			});
			return !(channel.users.find((u) => u.id == userId));
		}

	async isAlreadyBanned(channelId: number, userId: number) {
		const channel: Channel = await this.channelRepository.findOneOrFail({
			where: { id: channelId },
			relations: ["bannedUsers"]
		});
		return channel.bannedUsers.find((u) => u.id == userId);
	}

	async banUserFromChannel(channelId: number, userId: number): Promise<boolean>{
		try {
			const channels: Channel[] = await this.channelRepository.createQueryBuilder("channel")
			.leftJoinAndSelect("channel.users", "users")
			.leftJoinAndSelect("channel.bannedUsers", "bannedUsers").getMany();
			const channel = channels.find((c) => c.id == channelId);
			const userList = channel.users;
			if (!userList.find((u) => u.id == userId))
				return false;
			const user : User = await this.userRepository.findOneOrFail({
				where: { id: userId }
			});
			channel.bannedUsers.push(user);
			await this.channelRepository.save(channel);
			this.removeUserFromChannel(channelId, userId);
			return true;
		} catch (err) {
			throw err;
		}
	};

	async setChannelAdmin(channelId: number, userId: number): Promise<boolean> {
		try {
			const channel: Channel = await this.channelRepository.findOneOrFail({
				where: { id: channelId },
				relations: ["users", "admins"]
			});
			const user: User = await this.userRepository.findOneOrFail({
				where: { id: userId }
			});
			if (!channel.users.find((u) => u.id == userId))
				return false;
			channel.admins.push(user);
			await this.channelRepository.save(channel);
			return true;
		} catch (err) {
			throw err;
		}
	}
}