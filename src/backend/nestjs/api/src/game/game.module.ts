import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [UserModule],
	controllers: [GameController],
	providers: [GameService, GameGateway]
})
export class GameModule {};