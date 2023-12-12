import { Request, Response } from "express";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";
export declare class AuthService {
    private userService;
    constructor(userService: UserService);
    validateUser(dto: UserAuthDTO): Promise<User>;
    redirect(code: string, req: Request, res: Response): void;
    logout(req: Request, res: Response): void;
    getRandomCode(): Promise<string>;
    sendEmail(email: string): Promise<void>;
    switch_twofa(email: string): Promise<void>;
    setup_2fa(email: string, code: string): Promise<void>;
}
