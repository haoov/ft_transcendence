import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './postgreSQL/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { GameModule } from './game/game.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
							TypeOrmModule.forRoot(databaseConfig),
							UserModule,
							AuthModule,
							HealthModule,
							GameModule,
							HomeModule
						],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}