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
		@Query("2fa") code: string, 
		@Req() req: Request
	) {
		const user: User = req.user as User;
		await this.authService.setup_2fa(user.email, code);
		return { 'message': `2fa switched for ${user.username}` };
	}	

	@Get("test_2fa")
	@UseGuards(AuthentificatedGuard)
	async switch_twofa(@Req() req: Request) {
		const user: User = req.user as User;
		await this.authService.switch_twofa(user.email);
		return { 'message': `2fa switched for ${user.username}` };
	}
}