import { Controller, Get, Post, Param, Req, Put, Query, Body, ValidationPipe, UseGuards, Delete } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
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

	@Get('/channels')
	async getUserChannels(@Req() request: Request): Promise<Channel[]> {
		try {
			return await this.chatService.getUserChannels(request.user['id']);
		}
		catch (err) {
			throw err;
		}
	}

	@Get('/channel/addable')
	async getAddableUsers(
		@Req() request: Request,
		@Query('id') channelId: number) {
		try {
			return await this.chatService.getAddableUsers(channelId, request.user['id']);
		}
		catch (err) {
			throw err;
		}
	}

	@Get('/channels/joinable')
	async getJoinableChannels(@Req() request: Request): Promise<Channel[]> {
		try {
			return await this.chatService.getJoinableChannels(request.user['id']);
		}
		catch (err) {
			throw err;
		}
	}

	@Post('/channel')
	async createChannel(@Body() channelDTO: ChannelDTO) {
		try {
			if (channelDTO.mode === 'Protected')
				channelDTO.password = await ft_encode(channelDTO.password);
			const channel: Channel = await this.chatService.createChannel(channelDTO);
			this.chatGateway.newChannel(channel);
		}
		catch (err) {
			throw err;
		}
	}

	@Put('/channel')
	async updateChannel(@Query('id') channelId: number, @Body() channelDTO: ChannelDTO) {
		try {
			if (channelDTO.mode === 'Protected')
				channelDTO.password = await ft_encode(channelDTO.password);
			const channel: Channel = await this.chatService.updateChannel(channelId, channelDTO);
			this.chatGateway.channelUpdate(channel);
		}
		catch (err) {
			console.log(err);
		}
	}

	@Delete('/channel')
	async deleteChannel(@Req() request: Request, @Query('id') channelId: number) {
		try {
			await this.chatService.deleteChannel(channelId, request.user['id']);
			this.chatGateway.channelDeleted(channelId);
		}
		catch (err) {
			throw err;
		}
	}

	@Delete('/channel/leave')
	async leaveChannel(@Req() request: Request, @Query('id') channelId: number) {
		try {
			if (await this.chatService.removeUserFromChannel(channelId, request.user['id']))
				this.chatGateway.channelLeft(channelId);
		}
		catch (err) {
			throw err;
		}
	}

	@Get('/channel/relations')
	async getChannelRelations(@Req() request: Request, @Query('id') channelId: number): Promise<UserRelation[]> {
		const blockingList = await this.userService.getBlockingList(request.user['id']);
		const blockedList = (await this.userService.getBlockedUsers(request.user['id'])).map((user) => user.id);
		const friendList = await this.userService.getMutualFriendList(request.user['id']);
		return await this.chatService.getChannelRelations(channelId, blockingList, blockedList, friendList);
	}
}
