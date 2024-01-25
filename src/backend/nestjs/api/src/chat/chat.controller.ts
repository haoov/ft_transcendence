import { Controller, Get, Post, Param, Req, Put, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { MessageRaw, Channel } from "./chat.interface";
import { User } from "src/user/user.interface";
import { Request } from "express";
import { UserGateway } from "src/user/user.gateway";

interface Message {
	id: number;
	sender: UserEntity;
	message: {
		text: string;
		time: string;
	};
};

function isBlocked(user: UserEntity, blockedUsers: UserEntity []) : boolean {
	if (blockedUsers) {
		for (const blockedUser of blockedUsers) {
			if (blockedUser.id === user.id)
				return true;
		}
	}
	return false;
}

function convertRawMessagesToMessages(
	messagesRaw: MessageRaw [], users: UserEntity [], blockedUsers: UserEntity []
	) : Message [] {
	
		let messages: Message [] = [];
	for (const message of messagesRaw) {
		const user = users.find((user) => { return user.id === message.senderId });
		if (!isBlocked(user, blockedUsers)) {
			let messageConverted: Message = {
				id: message.id,
				sender: user,
				message: {
					text: message.text,
					time: message.timestamp,
				}
			};
			messages.push(messageConverted);
		}
	}
	return messages;
}

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService,
		private readonly userGateway: UserGateway
		) {}

	@Get('/messages')
	async getAllMessages(): Promise<Message []> {
		const users = await this.userService.getAllUsers();
		const messagesRaw = await this.chatService.getAllMessages();
		const messages = convertRawMessagesToMessages(messagesRaw, users as UserEntity [], null);
		return messages;
	}

	@Get('messages/:idChannel')
	async getAllMessagesByChannel(@Param('idChannel') idChannel: string, @Req() req : Request): Promise<Message []> {
		const user = req.user as User;
		const idOfSender = user.id;
		const idOfChannel = parseInt(idChannel);
		const channelUsers = await this.chatService.getUsersByChannelId(idOfChannel);
		if (!channelUsers.find((user) => { return user.id === idOfSender })) {
			throw new Error("You are not in this channel");
		}
		const users = await this.userService.getAllUsers();
		const messagesRaw = await this.chatService.getAllMessagesByChannel(idOfChannel);
		const blockedUsers = await this.userService.getBlockedUsers(idOfSender);
		const messages = convertRawMessagesToMessages(messagesRaw, users as UserEntity [], blockedUsers as UserEntity []);
		return messages;
	}

	@Get('/channels')
	async getCurrentUserChannels(@Req() req : Request): Promise<Channel []> {
		const user = req.user as User;
		const userId = user.id;
		return await this.chatService.getCurrentUserChannels(userId);
	}

	@Get('/channels/joinable')
	async getJoinableChannels(@Req() req : Request): Promise<Channel []> {
		const user = req.user as User;
		const userId = user.id;
		return await this.chatService.getJoinableChannels(userId);
	}

	@Put('/block')
	async blockUser(@Query('id') idToBlock: number, @Req() req : Request): Promise<void> {
		const user = req.user as User;
		await this.userService.blockUser(user.id, idToBlock);
		this.userGateway.dataChanged(user);
	}

	@Put('/unblock')
	async unblockUser(@Query('id') idToUnblock: number, @Req() req : Request): Promise<void> {
		const user = req.user as User;
		await this.userService.unblockUser(user.id, idToUnblock);
		this.userGateway.dataChanged(user);
	}
}
