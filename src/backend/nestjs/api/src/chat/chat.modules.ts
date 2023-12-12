
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";

@Module({
	imports: [UserModule],
	providers: [ChatGateway, ChatService],
})
export class ChatModule {};