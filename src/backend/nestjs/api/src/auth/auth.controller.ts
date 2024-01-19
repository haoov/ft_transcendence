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
	@UseGuards(Authentificated2faGuard)
	checkAuth() {}

	@Get("login")
	@UseGuards(Intra42Guard)
	async login(@Res() res: Response): Promise<Response> {
		return res;
	}

	@Get("42-redirect")
	@UseGuards(Intra42Guard)
	async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const user: User = await this.userService.getUserById((req.user as User).id);
		if (user.twofa_enabled && !user.twofa_auth) {
			console.log("redirect to 2fa");
			res.status(302).redirect("/twofa");
		}
		else {
			console.log("redirect to home");
			res.status(302).redirect("/");
		}
	}

	@Get("2fa")
	@UseGuards(AuthentificatedGuard)
	async get2FA(@Req() req: Request) {
		const user: User = req.user as User;
		const userDB = await this.userService.getUserById(user.id);
		return { 
			"twofa_status": userDB.twofa_enabled,
			"twofa_logged": userDB.twofa_auth
		};
	}

	@Post('2fa/turn-on')
	@UseGuards(AuthentificatedGuard)
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
		await this.userService.set2faMode(user.id, true);
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
		this.userService.set2faAuth(user.id, true);
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
		await this.userService.set2faMode(user.id, false);
		return "2fa reset"
	}

	@Get("logout")
	@UseGuards(AuthentificatedGuard)
	logout(@Req() req: Request, @Res() res: Response) {
		this.authService.logout(req, res);
	}
}