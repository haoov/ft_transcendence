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
		private readonly jwtService: JwtService,
	) {}

	async validateUser(dto: UserAuthDTO): Promise<User> {
		const user: User = await this.userService.getUser(dto.email);
		if (!user)
			return await this.userService.createUser(dto as User);
		return user;
	}

	redirect(code: string, res: Response) {
		if (!code)
			throw new ForbiddenException("No code provided");
		res.status(302).redirect("/");
	}

	async login(user: Partial<User>) {
		const payload = {
			email: user.email
		}

		return {
			email: payload.email,
			access_token: this.jwtService.sign(payload)
		}
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

	async get2faCode(user: User) : Promise<any> {
		const secret: string = authenticator.generateSecret();
		const optAuthUrl = authenticator.keyuri(user.email, process.env.otpURL, secret);
		await this.userService.set2faSecret(secret, user.email);

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

	async loginWith2fa(user: Partial<User>) {
		const payload = {
			email: user.email,
			is_2fa_enabled: !!user.twofa_enabled,
			is_2fa_auth: true,
		}
		return {
			email: payload.email,
			access_token: this.jwtService.sign(payload),
		}
	}
}

