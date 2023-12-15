import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameGatewayService } from './game.gateway.service';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [UserModule],
	providers: [GameGateway, GameGatewayService],
})
export class GameModule {}