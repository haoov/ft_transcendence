import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './typeOrm/database.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
							TypeOrmModule.forRoot(databaseConfig),
							UserModule
						],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}