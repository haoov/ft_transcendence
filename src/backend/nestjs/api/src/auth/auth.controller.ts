import { Body, Controller, Post, Get, Query, RawBodyRequest, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Intra42Guard } from "./guards/auth.Intra42Guard";
import { Request, Response } from "express";
import { AuthentificatedGuard } from "./guards/auth.AuthentificatedGuard";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.interface";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {}

	@Get()
	@UseGuards(AuthentificatedGuard)
	checkAuth() {}

	@Get("login")
	@UseGuards(Intra42Guard)
	async login(@Res() res: Response): Promise<Response> {
		return res;
	}

	@Get("42-redirect")
	@UseGuards(Intra42Guard)
	async redirect(@Query("code") code: string, @Res({ passthrough: true }) res: Response) {
		this.authService.redirect(code, res);
	}

	@Get("2fa")
	@UseGuards(Intra42Guard)
	async get2FA(@Res() response: Response): Promise<Response> {
		return response;
	}

	@Post('2fa/turn-on')
	@UseGuards(AuthentificatedGuard)
	async swithOn2fa(@Req() req: Request, @Body() body: RawBodyRequest<any>) {
		const user: any = req.user;
		console.log(body);
		const isCodeValid = this.authService.is2faValid(
			body.twofaCode,
			user,
		);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong Auth Code');
		await this.userService.set2faMode(user.email, true);
	}

	@Get('2fa/generate')
	@UseGuards(AuthentificatedGuard)
	async generateQRCode(@Req() req: Request) {
		const user: User = req.user as User;
		return this.authService.get2faQRcode(user.twofa_secret);
	}

	@Post('2fa/authentificated')
	@UseGuards(AuthentificatedGuard)
	async authentificate(@Req() req: Request, @Body() body: RawBodyRequest<any>) {
		const user: any = req.user;
		const isCodeValid = this.authService.is2faValid(
			body.twofaCode,
			user,
		);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong Auth Code');
		return this.authService.loginWith2fa(user.email);
	}

	@Get("logout")
	@UseGuards(AuthentificatedGuard)
	logout(@Req() req: Request, @Res() res: Response) {
		this.authService.logout(req, res);
	}

	@Get("test")
	@UseGuards(AuthentificatedGuard)
	async random(@Req() req: Request) {
		const user: any = req.user;
		return { 'message': `email sent to ${user.email}` }; 
	}
}