import { ForbiddenException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

import axios, { AxiosResponse } from 'axios';

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
	host: "smtp.eu.mailgun.org",
	port: 587,
	auth: {
	  user: "postmaster@42.hololive.fr",
	  pass: process.env.MAILGUN_KEY,
	},
});

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async validateUser(dto: UserAuthDTO): Promise<User> {
		const user: User = await this.userService.getUser(dto.email);
		if (!user)
			return await this.userService.createUser(dto as User);
		return user;
	}

	redirect(code: string, req: Request, res: Response) {
		if (!code)
			throw new ForbiddenException("No code provided");
		const userInfo: any = req.user;
		if (userInfo.twofa_enabled == true) {
			res.status(302).redirect("/api/auth/2fa");
		}
		res.status(302).redirect("/");
	}

	logout(req: Request, res: Response) {
		req.session.destroy(() => {
			res.clearCookie("connect.sid");
			res.status(302).redirect("/login");
		});
	}

	async getRandomCode(): Promise<string> {

		const opts: any = {
			"jsonrpc": "2.0",
			"method": "generateStrings",
			"params": {
				"apiKey": process.env.RANDOM_ORG_KEY,
				"n": 8,
				"length": 6,
				"characters": "0123456789",
				"replacement": true
			},
			"id": 42
		}

		try {
			const res: AxiosResponse = await axios.post("https://api.random.org/json-rpc/4/invoke", opts);
			return res.data.result.random.data[0];

		} catch (err) {
			throw err;
		}
	}

	async sendEmail(email: string) {
		try {
			const code: string = await this.getRandomCode();
			await this.userService.add2FACode(email, code)
			
			console.log(`${code} was sent to ${email}`);
			// const info: any = await transporter.sendMail({
			// 	from: '"Transcendence Authentification Process" <2fa@42.hololive.fr>', // sender address
			// 	to: "jopadova@student.42.fr ", // list of receivers
			// 	subject: `${code} is your login passcode`, // Subject line
			// 	text: `${code} is your login passcode`, // plain text body
			// 	html: `<b>${code} is your login passcode</b>`, // html body
			// });
		} catch (err) {
			throw err;
		}
	}

}

