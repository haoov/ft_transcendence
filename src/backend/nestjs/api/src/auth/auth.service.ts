import { Injectable } from "@nestjs/common";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

import { authenticator } from "otplib";
import { toDataURL } from 'qrcode'
import { JwtService } from "@nestjs/jwt";
import TokenPayload from "./tokenPayload.interface";

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

	getCookieWithJwtToken(id: number) {
		const payload: TokenPayload = { id };
		const token = this.jwtService.sign(payload);
		const EXPIRE = 3600;
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${EXPIRE}`;
	}

	getCookieForLogout() {
		return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
	}

	getCookieWithJwtAccessToken(id: number, twofaAuth = false) {
		const payload: TokenPayload = { id, twofaAuth };
		const EXPIRE = 3600;
		const token = this.jwtService.sign(payload, {
			secret: process.env.JWT_ACCESS_TOKEN_SECRET,
			expiresIn: EXPIRE,
		});
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${EXPIRE}`;
	  }

	async get2faQRcode(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async get2faSecret(user: User) : Promise<any> {
		const secret: string = authenticator.generateSecret();
		const optAuthUrl = authenticator.keyuri(user.email, process.env.OTP_NAME, secret);
		await this.userService.set2faSecret(user.id, secret);
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

