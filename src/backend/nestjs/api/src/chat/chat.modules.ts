
import { Module } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity, ChannelEntity } from 'src/postgreSQL/entities/chat.entity';
import { UserEntity } from 'src/postgreSQL/entities/user.entity';
import { ChatController } from "./chat.controller";
import { UserGateway } from "src/user/user.gateway";
import { GameGateway } from "src/game/game.gateway";
import { GameModule } from "src/game/game.module";


@Module({
	imports: [TypeOrmModule.forFeature([MessageEntity, ChannelEntity, UserEntity]), GameModule],
	providers: [ChatGateway, ChatService, UserService, UserGateway],
	controllers: [ChatController],

})
export class ChatModule {};