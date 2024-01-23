import { Body, Controller, Post, Get, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Intra42Guard } from "./intra42/auth.Intra42Guard";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
import { Body2faDTO, User } from "src/user/user.interface";
import JwtAuthGuard from "./jwt/jwt.guard";
import Jwt2faGuard from "./jwt-2fa/jwt-2fa.guard";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {}

	@Get()
	@UseGuards(Jwt2faGuard)
	checkAuth() {}

	@Get("login")
	@UseGuards(Intra42Guard)
	async login(@Req() req: Request, @Res() res: Response): Promise<Response> {
		const user: User = await this.userService.getUserById((req.user as User).id);
		return res.send(user);
	}

	@Get("42-redirect")
	@UseGuards(Intra42Guard)
	async redirect(@Req() req: Request, @Res() res: Response) {
		const user: User = await this.userService.getUserById((req.user as User).id);
		const cookie = this.authService.getCookieWithJwtToken(user.id);
		res.setHeader('Set-Cookie', cookie);
		if (user.twofa_enabled) 
			return res.redirect("/twofa");
		return res.redirect("/");
	}

	@Get("2fa")
	@UseGuards(JwtAuthGuard)
	async get2FA(@Req() req: Request) {
		const user: User = req.user as User;
		const userDB = await this.userService.getUserById(user.id);
		return { 
			"twofa_status": userDB.twofa_enabled,
		};
	}

	@Post('2fa/turn-on')
	@UseGuards(JwtAuthGuard)
	async swithOn2fa(@Req() req: Request, @Body() body: Body2faDTO) {
		const user_tmp: User = req.user as User;
		const user = await this.userService.getUserById(user_tmp.id);
		if (!user.twofa_secret)
			throw new UnauthorizedException('no secret generated');
		const isCodeValid = this.authService.is2faValid(
			body.twofaCode,
			user,
		);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong Auth Code');
		const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id, true);
		req.res.setHeader('Set-Cookie', [accessTokenCookie]);
	}

	@Get('2fa/generate')
	@UseGuards(JwtAuthGuard)
	async generateQRCode(@Res() res: Response, @Req() req: Request) {
		const user: User = req.user as User;

		const { optAuthUrl } = await this.authService.get2faSecret(user);

		return res.json(
			await this.authService.get2faQRcode(optAuthUrl)
		);
	}

	@Post('2fa/authenticate')
	@UseGuards(JwtAuthGuard)
	async authentificate(@Req() req: Request, @Body() body: Body2faDTO) {
		const user_tmp: User = req.user as User;
		const user = await this.userService.getUserById(user_tmp.id);
		if (!user.twofa_enabled)
			throw new UnauthorizedException('no 2fa needed');
		if (!user.twofa_secret)
			throw new UnauthorizedException('no secret generated');
		const isCodeValid = this.authService.is2faValid(
			body.twofaCode,
			user,
		);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong Auth Code');
		const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id, true);
		req.res.setHeader('Set-Cookie', [accessTokenCookie]);
		return { "message": "2fa logged"}
	}

	@Get("2fa/test")
	@UseGuards(JwtAuthGuard)
	async random() {
		return { 'message': `logged with 2fa` }; 
	}

	@Get('2fa/reset')
	@UseGuards(JwtAuthGuard)
	async reset(@Req() req: Request) {
		const user: User = req.user as User;
		await this.userService.set2faMode(user.id, false);
		return "2fa reset"
	}

	@Get("logout")
	@UseGuards(JwtAuthGuard)
	logout(@Req() req: Request, @Res() res: Response) {
		res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
   		return res.sendStatus(200);
	}
}