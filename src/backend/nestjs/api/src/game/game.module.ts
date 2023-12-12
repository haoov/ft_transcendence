import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameGatewayService } from './game.gateway.service';

@Module({
  providers: [GameGateway, GameGatewayService],
})
export class GameModule {}