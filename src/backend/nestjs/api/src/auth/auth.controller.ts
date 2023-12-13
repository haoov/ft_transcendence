import { Controller, ForbiddenException, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Intra42Guard } from "./guards/auth.Intra42Guard";
import { Request, Response } from "express";
import { AuthentificatedGuard } from "./guards/auth.AuthentificatedGuard";
import { User } from "src/user/user.interface";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	@UseGuards(AuthentificatedGuard)
	checkAuth() {}

	@Get("login")
	@UseGuards(Intra42Guard)
	async login(@Res() response: Response): Promise<Response> {
		return response;
	}

	@Get("42-redirect")
	@UseGuards(Intra42Guard)
	async redirect(
		@Query("code") code: string, 
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request
	) {
		this.authService.redirect(code, req, res);
	}

	@Get("2fa")
	@UseGuards(AuthentificatedGuard)
	get2FA(@Req() req: Request) {
		const user: User = req.user as User;
		return { 'is2faEnabled': user.twofa_enabled };
	}

	@Get("logout")
	@UseGuards(AuthentificatedGuard)
	logout(@Req() req: Request, @Res() res: Response) {
		this.authService.logout(req, res);
	}

	@Get("test_mail")
	@UseGuards(AuthentificatedGuard)
	async random(@Req() req: Request) {
		const user: User = req.user as User;
		await this.authService.sendEmail(user.email);
		return { 'message': `email sent to ${user.email}` };
	}

	@Get("setup_2fa")
	// @UseGuards(AuthentificatedGuard)
	async setup_2fa(
		@Query("code") code: string, 
		@Req() req: Request
	) {
		const user: User = req.user as User;
		await this.authService.setup_2fa(user.email, code);
		return { 'message': `2fa switched for ${user.username}` };
	}	

	@Get("set_2fa_stat")
	@UseGuards(AuthentificatedGuard)
	async set_twofa_stat(
		@Req() req: Request,
		@Query("stat") stat: boolean, 
	) {
		if (!stat) return { "error": "no stat provided" };
		const user: User = req.user as User;
		await this.authService.set_twofa_stat(user.email, stat);
		return { 'message': `2fa enabled for ${user.username}` };
	}
}