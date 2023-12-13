
import { Module } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity, ChannelEntity } from 'src/postgreSQL/entities/chat.entity';
import { UserEntity } from 'src/postgreSQL/entities/user.entity';
import { ChatController } from "./chat.controller";


@Module({
	imports: [TypeOrmModule.forFeature([MessageEntity, ChannelEntity, UserEntity])],
	providers: [ChatGateway, ChatService, UserService],
	controllers: [ChatController],

})
export class ChatModule {};