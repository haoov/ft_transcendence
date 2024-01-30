import { Controller, Get, Post, Param, Req, Put, Query, Body, ValidationPipe, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
import { Message, Channel } from "./chat.interface";
import { User, UserRelation } from "src/user/user.interface";
import { Request } from "express";
import Jwt2faGuard from "../auth/jwt-2fa/jwt-2fa.guard";
import { UserGateway } from "src/user/user.gateway";
import { ChatGateway } from "./chat.gateway";
import { ChannelDTO, MessageDTO } from "./dto/chat.dto";

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

	@Post('/channel')
	async createChannel(@Body() channelDTO: ChannelDTO) {
		try {
			const channel: Channel = await this.chatService.createChannel(channelDTO);
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

	@Get('/channel/users')
	async getChannelUsers(@Req() request: Request, @Query('id') channelId: number): Promise<UserRelation[]> {
		return await this.chatService.getChannelUsers(request.user['id'], channelId);
	}
}
