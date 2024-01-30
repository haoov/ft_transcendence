import { Controller, Get, Post, Param, Req, Put, Query, Body, ValidationPipe, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { Message, Channel } from "./chat.interface";
import { User, UserRelation } from "src/user/user.interface";
import { Request } from "express";
import Jwt2faGuard from "../auth/jwt-2fa/jwt-2fa.guard";
import { UserGateway } from "src/user/user.gateway";
import { ChatGateway } from "./chat.gateway";
import { ChannelDTO, MessageDTO } from "./dto/chat.dto";
import * as bcrypt from 'bcrypt';

async function ft_encode(str: string): Promise<string> {
	const saltOrRounds = 10;
	const hash = await bcrypt.hash(str, saltOrRounds);
	return hash;
 }

@UseGuards(Jwt2faGuard)
@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly chatGateway: ChatGateway,
		private readonly userService: UserService,
		private readonly userGateway: UserGateway
		) {}

	// @Get('/messages')
	// async getAllMessages(): Promise<Message []> {
	// 	const users = await this.userService.getAllUsers();
	// 	const messagesRaw = await this.chatService.getAllMessages();
	// 	const messages = convertRawMessagesToMessages(messagesRaw, users as UserEntity [], null);
	// 	return messages;
	// }

	// @Get('messages/:idChannel')
	// async getAllMessagesByChannel(@Param('idChannel') idChannel: string, @Req() req : Request): Promise<Message []> {
	// 	const user = req.user as User;
	// 	const idOfSender = user.id;
	// 	const idOfChannel = parseInt(idChannel);
	// 	const channelUsers = await this.chatService.getUsersByChannelId(idOfChannel);
	// 	if (!channelUsers.find((user) => { return user.id === idOfSender })) {
	// 		throw new Error("You are not in this channel");
	// 	}
	// 	const users = await this.userService.getAllUsers();
	// 	const messagesRaw = await this.chatService.getAllMessagesByChannel(idOfChannel);
	// 	const blockedUsers = await this.userService.getBlockedUsers(idOfSender);
	// 	const messages = convertRawMessagesToMessages(messagesRaw, users as UserEntity [], blockedUsers as UserEntity []);
	// 	return messages;
	// }

	// @Get('/channel/users')
	// async getChannelUsers(@Query('id') channelId: number): Promise<User[]> {
	// 	const users = await this.chatService.getUsersByChannelId(channelId);
	// 	return users;
	// }

	// @Get('/channels')
	// async getCurrentUserChannels(@Req() req : Request): Promise<Channel []> {
	// 	const user = req.user as User;
	// 	const userId = user.id;
	// 	return await this.chatService.getCurrentUserChannels(userId);
	// }

	// @Get('/channels/joinable')
	// async getJoinableChannels(@Req() req : Request): Promise<Channel []> {
	// 	const user = req.user as User;
	// 	const userId = user.id;
	// 	return await this.chatService.getJoinableChannels(userId);
	// }

	// @Put('/block')
	// async blockUser(@Query('id') idToBlock: number, @Req() req : Request): Promise<void> {
	// 	const user = req.user as User;
	// 	await this.userService.blockUser(user.id, idToBlock);
	// 	this.userGateway.dataChanged(user);
	// }

	// @Put('/unblock')
	// async unblockUser(@Query('id') idToUnblock: number, @Req() req : Request): Promise<void> {
	// 	const user = req.user as User;
	// 	await this.userService.unblockUser(user.id, idToUnblock);
	// 	this.userGateway.dataChanged(user);
	// }

	/*----------------------------------------------------------------------------*/
	/*                                    RAPH                                    */
	/*----------------------------------------------------------------------------*/

	@Get('/channels')
	async getUserChannels(@Req() request: Request): Promise<Channel[]> {
		return await this.chatService.getUserChannels(request.user['id']);
	}

	@Get('/channel/addable')
	async getAddableUsers(@Query('id') channelId: number, @Query('userId') userId: number): Promise<User[]> {
		return await this.chatService.getAddableUsers(channelId, userId);
	}

	@Get('/channels/joinable')
	async getJoinableChannels(@Req() request: Request): Promise<Channel[]> {
		return await this.chatService.getJoinableChannels(request.user['id']);
	}

	// @Get('/channels/admins')
	// async getAdmins(@Query("id") id : number) : Promise<User []> {
	// 	try {
	// 		return await this.chatService.getAdminsByChannelId(id);
	// 	} catch (err) {
	// 		throw err;
	// 	}
	// }
    
	// @Get('/channels/banned')
	// async getBanlist(@Query("id") id : number): Promise<User []> {
	// 	try {
	// 		return await this.chatService.getBannedUsersByChannelId(id);
	// 	} catch (err) {
	// 		throw err;
	// 	}
	// }

	@Post('/channel')
	async createChannel(@Body() channelDTO: ChannelDTO) {
		try {
			if (channelDTO.mode === 'Protected')
				channelDTO.password = await ft_encode(channelDTO.password);
			const channel: Channel = await this.chatService.createChannel(channelDTO);
			console.log(channel);
			this.chatGateway.newChannel(channel);
		}
		catch (err) {
			console.log(err);
		}
	}

	@Put('/channel')
	async updateChannel(@Query('id') channelId: number, @Body() channelDTO: ChannelDTO) {
		try {
			const channel: Channel = await this.chatService.updateChannel(channelId, channelDTO);
			this.chatGateway.channelUpdate(channel);
		}
		catch (err) {
			console.log(err);
		}
	}

	@Post('/message')
	async createMessage(@Body() messageDTO: MessageDTO) {
		try {
			const message: Message = await this.chatService.createMessage(messageDTO);
			const channel: Channel = await this.chatService.getChannel(messageDTO.channelId);
			this.chatGateway.newMessage(message, channel);
		}
		catch (err) {
			console.log(err);
		}
	}

	@Get('/channel/users')
	async getChannelUsers(@Req() request: Request, @Query('id') channelId: number): Promise<UserRelation[]> {
		return await this.chatService.getChannelUsers(request.user['id'], channelId);
	}
}
