import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity, UserEntity } from 'src/postgreSQL/entities';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, GameEntity])],
	controllers: [HomeController],
	providers: [HomeService],
})
export class HomeModule {}
