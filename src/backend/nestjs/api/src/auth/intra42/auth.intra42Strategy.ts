import { ForbiddenException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { AuthService } from "../auth.service";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { UserValidate } from "../auth.interface";

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private readonly authService: AuthService,
	) {
		super({
			clientID: process.env.INTRA_CLIENT_ID,
			clientSecret: process.env.INTRA_CLIENT_SECRET,
			callbackURL: process.env.LOCAL_CALLBACK,
			scope: "public"
		});
	}

	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		if (err || !user) {
		  throw new HttpException(err.message, err.status);
		}
		return user;
	  }


	async validate(accesToken: string, refreshToken: string, profile: Profile): Promise<any> {
		// callback();	
		const userInfos: UserAuthDTO = {
			username: profile.username,
			avatar: profile._json.image.link,
			email: profile.emails[0]['value']
		};
		const userValidated: UserValidate = await this.authService.validateUser(userInfos);
		if (!userValidated)
			throw new UnauthorizedException();
		return userValidated;
	}

}