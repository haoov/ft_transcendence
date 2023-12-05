import { Controller, ForbiddenException, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Intra42Guard } from "./guards/auth.Intra42Guard";
import { Request, Response } from "express";
import { AuthentificatedGuard } from "./guards/auth.AuthentificatedGuard";

@Controller("auth")
export class AuthCoontroller {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(Intra42Guard)
	@Get("login")
	async login(@Res() response: Response): Promise<Response> {
		return response;
	}

	@UseGuards(Intra42Guard)
	@Get("42-redirect")
	async redirect(@Query("code") code: string, @Res({ passthrough: true }) res: Response) {
		this.authService.redirect(code, res);
	}

	@UseGuards(AuthentificatedGuard)
	@Get("logout")
	logout(@Req() req: Request, @Res() res: Response) {
		this.authService.logout(req, res);
	}
}