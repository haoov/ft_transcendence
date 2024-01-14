import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { UserGateway } from "./user.gateway";
import { GameModule } from "src/game/game.module";

@Module({
	imports: [forwardRef(() => GameModule), TypeOrmModule.forFeature([UserEntity])],
	controllers: [UserController],
	providers: [UserService, UserGateway],
	exports: [UserService, UserGateway]
})
export class UserModule {}