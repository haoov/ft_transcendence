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
			return false;
		}
		
		return request.isAuthenticated() || true;
	}
}