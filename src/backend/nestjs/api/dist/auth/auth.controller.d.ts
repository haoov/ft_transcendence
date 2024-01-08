import { RawBodyRequest } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    checkAuth(): void;
    login(res: Response): Promise<Response>;
    redirect(code: string, res: Response): Promise<void>;
    get2FA(response: Response): Promise<Response>;
    swithOn2fa(req: Request, body: RawBodyRequest<any>): Promise<void>;
    generateQRCode(req: Request): Promise<any>;
    authentificate(req: Request, body: RawBodyRequest<any>): Promise<{
        email: string;
        access_token: string;
    }>;
    logout(req: Request, res: Response): void;
    random(req: Request): Promise<{
        message: string;
    }>;
}
