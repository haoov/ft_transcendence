import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { UserService } from "src/user/user.service";
import { Body2faDTO, User } from "src/user/user.interface";
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    checkAuth(): void;
    login(res: Response): Promise<Response>;
    redirect(res: Response): Promise<void>;
    get2FA(req: Request): Promise<User>;
    swithOn2fa(req: Request, body: Body2faDTO): Promise<void>;
    generateQRCode(res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    authentificate(req: Request, body: Body2faDTO): Promise<{
        message: string;
    }>;
    random(): Promise<{
        message: string;
    }>;
    reset(req: Request): Promise<string>;
    logout(req: Request, res: Response): void;
}
