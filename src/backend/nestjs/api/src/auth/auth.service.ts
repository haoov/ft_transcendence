import { ForbiddenException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

import { authenticator } from "otplib";
import { toDataURL } from 'qrcode'
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
	) {}

	async validateUser(dto: UserAuthDTO): Promise<User> {
		const user: User = await this.userService.getUser(dto.email);
		if (!user)
			return await this.userService.createUser(dto as User);
		return user;
	}

	logout(req: Request, res: Response) {
		req.session.destroy(() => {
			res.clearCookie("connect.sid");
			res.status(302).redirect("/login");
		});
	}

	async get2faQRcode(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async get2faSecret(user: User) : Promise<any> {
		const secret: string = authenticator.generateSecret();
		const optAuthUrl = authenticator.keyuri(user.email, process.env.OTP_NAME, secret);
		await this.userService.set2faSecret(user.email, secret);
		return {
			secret,
			optAuthUrl
		};
	}

	is2faValid(code: string, user: User) {
		return authenticator.verify({
			token: code,
			secret: user.twofa_secret,
		})
	}
}

