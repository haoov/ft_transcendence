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
			console.log(request.isAuthenticated());
			return true;
		}
		const userDB: User = await this.userService.getUser(user.email);
		if (userDB.twofa_enabled == false) {
			console.log("2fa is false");
			return request.isAuthenticated() || true;
		}
		return false;
	}
}