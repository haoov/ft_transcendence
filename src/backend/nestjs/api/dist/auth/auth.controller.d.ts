import { AuthService } from "./auth.service";
import { Request, Response } from "express";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    checkAuth(): void;
    login(response: Response): Promise<Response>;
    redirect(code: string, res: Response, req: Request): Promise<void>;
    get2FA(req: Request): {
        is2faEnabled: boolean;
    };
    logout(req: Request, res: Response): void;
    random(req: Request): Promise<{
        message: string;
    }>;
    setup_2fa(code: string, req: Request): Promise<{
        message: string;
    }>;
    switch_twofa(req: Request): Promise<{
        message: string;
    }>;
}
