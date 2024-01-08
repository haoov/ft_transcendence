import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { UserEntity } from "src/postgreSQL/entities/user.entity";

import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Auth42Strategy } from "./stategies/auth.42strategy";
import { Jwt2faStrategy } from "./stategies/auth.jwtstrategy";
import { SessionSerializer } from "./auth.sessionSerializer";

@Module({
	imports: [
		UserModule, 
		PassportModule.register({ session: true }),
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.register({
			secret: 'secret',
			signOptions: { expiresIn: '1d' },
		})
	],
	controllers: [AuthController],
	providers: [AuthService, Auth42Strategy, Jwt2faStrategy, SessionSerializer]
})
export class AuthModule {}