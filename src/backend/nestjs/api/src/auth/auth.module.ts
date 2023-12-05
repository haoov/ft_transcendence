import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionSerializer } from "./auth.sessionSerializer";
import { Auth42Strategy } from "./auth.42strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [UserModule, PassportModule.register({ session: true })],
	controllers: [AuthController],
	providers: [AuthService, Auth42Strategy, SessionSerializer]
})
export class AuthModule {}