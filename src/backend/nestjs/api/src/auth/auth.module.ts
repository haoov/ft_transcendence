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
import { JwtStrategy } from "./jwt/jwt.strategy";
import { Jwt2faStrategy } from "./jwt-2fa/jwt-2fa.strategy";

@Module({
	imports: [
		UserModule, 
		PassportModule.register({ session: true }),
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.register({
			secret: process.env.JWT_ACCESS_TOKEN,
			signOptions: { expiresIn: 86400 },
		}),
	],
	controllers: [ AuthController ],
	providers: [
		AuthService, 
		SessionSerializer,
		Auth42Strategy, 
		JwtStrategy,
		Jwt2faStrategy,
	]
})
export class AuthModule {}