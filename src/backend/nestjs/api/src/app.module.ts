import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './postgreSQL/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ChatModule } from './chat/chat.modules';

@Module({
  imports: [
							TypeOrmModule.forRoot(databaseConfig),
							UserModule,
							AuthModule,
							HealthModule,
							ChatModule,
						],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}