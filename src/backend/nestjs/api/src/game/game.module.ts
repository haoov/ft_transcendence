import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameGatewayService } from './game.gateway.service';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [UserModule],
	controllers: [GameController],
	providers: [GameGateway, GameGatewayService, GameService],
})
export class GameModule {}