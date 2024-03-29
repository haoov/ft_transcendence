import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './postgreSQL/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ChatModule } from './chat/chat.modules';
import { GameModule } from './game/game.module';
import { StatsModule } from './stats/stats.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
	TypeOrmModule.forRoot(databaseConfig),
	UserModule,
	AuthModule,
	ChatModule,
	HealthModule,
	GameModule,
	StatsModule,
	ConfigModule.forRoot(),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}