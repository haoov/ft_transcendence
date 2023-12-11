import { Controller, ForbiddenException, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Intra42Guard } from "./guards/auth.Intra42Guard";
import { Request, Response } from "express";
import { AuthentificatedGuard } from "./guards/auth.AuthentificatedGuard";

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
	@UseGuards(Intra42Guard)
	async get2FA(@Res() response: Response): Promise<Response> {
		return response;
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
		await this.authService.sendEmail(user.email);
		return { 'message': `email sent to ${user.email}` }; 
	}
}