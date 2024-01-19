import { Module, forwardRef } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/postgreSQL/entities';

@Module({
	imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([GameEntity])],
	controllers: [GameController],
	providers: [GameGateway, GameService],
	exports: [GameService, GameGateway]
})
export class GameModule {}