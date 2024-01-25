
import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity, ChannelEntity } from 'src/postgreSQL/entities/chat.entity';
import { UserEntity } from 'src/postgreSQL/entities/user.entity';
import { ChatController } from "./chat.controller";
import { GameModule } from "src/game/game.module";
import { UserModule } from "src/user/user.module";


@Module({
	imports: [TypeOrmModule.forFeature([MessageEntity, ChannelEntity, UserEntity]), GameModule, UserModule],
	providers: [ChatGateway, ChatService],
	controllers: [ChatController],

})
export class ChatModule {};