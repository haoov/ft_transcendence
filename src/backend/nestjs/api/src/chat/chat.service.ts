import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity , ChannelEntity} from 'src/postgreSQL/entities/chat.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(MessageEntity) private messagesRepository: Repository<MessageEntity>,
		@InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>
		) {}

	/* MESSAGE */

	//Permet de charger les messages d'une conversation
	async getAllMessagesByChannel(channelId: number): Promise<Message []> {
		const MessageList: Message [] = await this.messagesRepository.find();
		return MessageList.filter((message) => {message.channelId === channelId});
	}

	// //Permet de créer un message dans la base de données
	// async createMessage(message: Message): Promise<Message> {
	// 	return await this.messagesRepository.create(message);
	// }

	// //A sup ?
	// //Permet d'editer un message dans la base de données
	// async saveMessage(message: Message): Promise<Message> {
	// 	return await this.messagesRepository.save(message);
	// }


	// /* CHANNEL */

	// //Permet de fetch tous les channels
	// async getAllChanel(): Promise<Channel []> {
	// 	return await this.channelRepository.find() as Channel [];
	// }

	// //Permet de créer un channel dans la base de données
	// async createChannel(channel: Channel): Promise<Channel> {
	// 	const channelList = await this.channelRepository.find() as Channel [];

	// 	if (!channel.name || !channel.creatorId || !channel.modeChanel)
	// 		return null;
	// 	else if (channelList.find((channel) => channel.name === channel.name))
	// 		return null;
	// 	return await this.channelRepository.create(channel);
	// }

	// //Permet d'editer un channel dans la base de données
	// async saveChannel(idEditor: number, idChannel: number, channel: Channel): Promise<Channel> {
	// 	const channelToEdit = await this.channelRepository.findOneBy({ id: idChannel });
	// 	if (!channelToEdit)
	// 		return null;
	// 	if (idEditor != channelToEdit.creatorId)
	// 		return null;
	// 	channelToEdit.name = channel.name;
	// 	channelToEdit.modeChanel = channel.modeChanel;
	// 	return await this.channelRepository.save(channelToEdit);
	// }

	// //Permet de supprimer un channel dans la base de données
	// async deleteChannel(idChannel: number, idUser: number): Promise<Channel> {
	// 	const channelToDelete = await this.channelRepository.findOneBy({ id: idChannel });
	// 	if (!channelToDelete)
	// 		return null;
	// 	if (channelToDelete.creatorId != idUser)
	// 		return null;
	// 	return await this.channelRepository.delete(idChannel);//Pas suuuuuuuu
	// }
}