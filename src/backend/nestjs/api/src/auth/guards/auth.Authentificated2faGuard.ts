import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class Authentificated2faGuard implements CanActivate {
	constructor (private readonly userService: UserService) {};

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const user: User = request.user as User;
		if (!user) {
			return false;
		}
		const userDB = await this.userService.getUserById(user.id);
		if (userDB.twofa_enabled == false) {
			return true;
		}
		
		if (userDB.twofa_auth == true) {
			return true;
		} else {
			return false;
		}

	}
}