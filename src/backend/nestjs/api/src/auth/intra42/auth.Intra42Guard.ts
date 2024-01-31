import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/user/user.interface";

@Injectable()
export class Intra42Guard extends AuthGuard('42') implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<any> {
		const activate = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest();
		await super.logIn(request);
		return activate;
	}

	handleRequest(err: any, user: any) {
		if (err || !user) {
		  	throw new ForbiddenException(err.message, err.status);
		}
		return user;
	  }
}