import { IsArray, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { User } from "src/user/user.interface";
import { Message } from "../chat.interface";

export class MessageDTO {
	@IsNotEmpty()
	sender: User;
	@IsInt()
	channelId: number;
	@IsNotEmpty()
	text: string;
	@IsNotEmpty()
	datestamp: string;
}

export class ChannelDTO {
	@IsNotEmpty()
	name: string;
	@IsInt()
	creatorId: number;
	@IsNotEmpty()
	mode: string;
	@IsOptional()
	password: string;
	@IsArray()
	users: User[];
	@IsArray()
	@IsOptional()
	messages: Message[];
	@IsArray()
	admins: User[];
}