import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { AuthService } from "../auth.service";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {
		super({
			clientID: process.env.INTRA_CLIENT_ID,
			clientSecret: process.env.INTRA_CLIENT_SECRET,
			callbackURL: process.env.LOCAL_CALLBACK,
			scope: "public"
		});
	}
	async validate(accesToken: string, refreshToken: string, profile: Profile): Promise<any> {
		const userInfos: UserAuthDTO = {
			username: profile.username,
			avatar: profile._json.image.link,
			email: profile.emails[0]['value']
		};
		const user: User = await this.authService.validateUser(userInfos);
		if (!user)
			throw new UnauthorizedException();		
		return user;
	}
}