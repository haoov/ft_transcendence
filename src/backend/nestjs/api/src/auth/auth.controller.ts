import { Body, Controller, Post, Get, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Intra42Guard } from "./intra42/auth.Intra42Guard";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
import { Body2faDTO, User } from "src/user/user.interface";
import JwtAuthGuard from "./jwt/jwt.guard";
import Jwt2faGuard from "./jwt-2fa/jwt-2fa.guard";
import { UserEntity } from "src/postgreSQL/entities";
import { UserValidate } from "./auth.interface";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {}

	@Get()
	@UseGuards(Jwt2faGuard)
	checkAuth(){
		return { "is_logged": true };
	}

	@Get("login")
	@UseGuards(Intra42Guard)
	async login(@Res() res: Response): Promise<Response> {
   		return res.status(200).send({
			"login_status": true
		});
	}

	@Get("logout")
	@UseGuards(JwtAuthGuard)
	logout(@Res() res: Response) {
		res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
		res.clearCookie("connect.sid");
   		return res.status(200).send({
			"login_status": false
		});
	}

	@Get("42-redirect")
	@UseGuards(Intra42Guard)
	async redirect(@Req() req: Request, @Res() res: Response) {
		const user: User = await this.userService.getUserById((req.user as User).id);
		const cookie = this.authService.getCookieWithJwtToken(user.id);
		res.setHeader('Set-Cookie', cookie);
		if (user.twofa_enabled) 
			return res.redirect("/login?2fa=true");
		if ((req.user as UserValidate).first_connection)
			return res.redirect("/settings");
		return res.redirect("/");
	}

	@Post('2fa/turn-on')
	@UseGuards(JwtAuthGuard)
	async swithOn2fa(@Req() req: Request, @Body() body: Body2faDTO) {
		const user: UserEntity = await this.userService.getUserById((req.user as User).id) as UserEntity;
		if (!user.twofa_secret)
			throw new UnauthorizedException('no secret generated');
		const isCodeValid = this.authService.is2faValid(
			body.twofaCode,
			user,
		);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong Auth Code');
		await this.userService.set2faMode(user.id, true);
		const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id, true);
		req.res.setHeader('Set-Cookie', [accessTokenCookie]);
		return { "twofa_status": true };
	}

	@Post('2fa/turn-off')
	@UseGuards(JwtAuthGuard)
	async swithOff2fa(@Req() req: Request) {
		const user = await this.userService.getUserById((req.user as User).id);
		if (!user.twofa_enabled)
			throw new UnauthorizedException('2fa already off');
		await this.userService.set2faMode(user.id, false);
		return { "twofa_status": false };
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
		const user: UserEntity = await this.userService.getUserById((req.user as User).id) as UserEntity;
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
		return { "twofa_logged": true}
	}
}