import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';

@Module({
  imports: [GameGateway],
})
export class GameModule {}