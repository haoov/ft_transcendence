import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthentificatedGuard implements CanActivate {
	constructor (private readonly userService: UserService) {};

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const user: User = request.user as User;
		if (!user) {
			console.log("user is null");
			return request.isAuthenticated();
		}
		const userDB: User = await this.userService.getUser(user.email);
		if (userDB.twofa_enabled == false) {
			console.log("2fa is false");
			return request.isAuthenticated() || true;
		}
		if (userDB.twofa_code == userDB.twofa_secret) {
			console.log("nice code");
			return request.isAuthenticated() || true;
		}
		console.log(`${userDB.twofa_code} == ${userDB.twofa_secret}`)
		return false;
	}
}