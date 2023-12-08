import { AuthService } from "./auth.service";
import { Request, Response } from "express";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    checkAuth(): void;
    login(response: Response): Promise<Response>;
    redirect(code: string, res: Response): Promise<void>;
    logout(req: Request, res: Response): void;
}
