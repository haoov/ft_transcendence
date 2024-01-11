import { Body, Controller, Post, Get, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Intra42Guard } from "./intra42/auth.Intra42Guard";
import { Request, Response } from "express";
import { AuthentificatedGuard } from "./guards/auth.AuthentificatedGuard";
import { UserService } from "src/user/user.service";
import { Body2faDTO, User } from "src/user/user.interface";
import { Authentificated2faGuard } from "./guards/auth.Authentificated2faGuard";

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
	async redirect(@Res({ passthrough: true }) res: Response) {
		res.status(302).redirect("/");
	}

	@Get("2fa")
	@UseGuards(AuthentificatedGuard)
	async get2FA(@Req() req: Request) {
		const user: User = req.user as User;
		return await this.userService.getUser(user.email);
	}

	@Post('2fa/turn-on')
	@UseGuards(AuthentificatedGuard)
	async swithOn2fa(@Req() req: Request, @Body() body: Body2faDTO) {
		const user: User = req.user as User;
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
	async generateQRCode(@Res() res: Response, @Req() req: Request) {
		const user: User = req.user as User;

		const { optAuthUrl } = await this.authService.get2faSecret(user);

		return res.json(
			await this.authService.get2faQRcode(optAuthUrl)
		);
	}

	@Post('2fa/authentificate')
	@UseGuards(AuthentificatedGuard)
	async authentificate(@Req() req: Request, @Body() body: Body2faDTO) {
		const user: User = req.user as User;
		const isCodeValid = this.authService.is2faValid(
			body.twofaCode,
			user,
		);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong Auth Code');
		user.twofa_auth = true;
		return { "message": "2fa logged"}
	}

	@Get("2fa/test")
	@UseGuards(Authentificated2faGuard)
	async random() {
		return { 'message': `logged with 2fa` }; 
	}

	@Get('2fa/reset')
	@UseGuards(AuthentificatedGuard)
	async reset(@Req() req: Request) {
		const user: User = req.user as User;
		user.twofa_auth = false;
		await this.userService.set2faMode(user.email, false);
		return "2fa reset"
	}

	@Get("logout")
	@UseGuards(AuthentificatedGuard)
	logout(@Req() req: Request, @Res() res: Response) {
		this.authService.logout(req, res);
	}
}