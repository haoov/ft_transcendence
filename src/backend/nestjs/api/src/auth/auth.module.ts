import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { UserEntity } from "src/postgreSQL/entities/user.entity";

import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Auth42Strategy } from "./intra42/auth.intra42Strategy";
import { SessionSerializer } from "./auth.sessionSerializer";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
	imports: [
		UserModule, 
		PassportModule.register({ session: true }),
		TypeOrmModule.forFeature([UserEntity]),
		ThrottlerModule.forRoot([{
			ttl: 6000,
			limit: 10,
		}])
	],
	controllers: [AuthController],
	providers: [
		AuthService, 
		Auth42Strategy, 
		SessionSerializer
	]
})
export class AuthModule {}