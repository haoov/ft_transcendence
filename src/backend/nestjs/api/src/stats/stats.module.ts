import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity, UserEntity } from 'src/postgreSQL/entities';
import { UserService } from 'src/user/user.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, GameEntity])],
	controllers: [StatsController],
	providers: [StatsService, UserService],
})
export class StatsModule {}
