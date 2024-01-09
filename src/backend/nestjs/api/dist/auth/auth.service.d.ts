import { Request, Response } from "express";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(dto: UserAuthDTO): Promise<User>;
    redirect(code: string, req: Request, res: Response): void;
    login(user: Partial<User>): Promise<{
        email: string;
        access_token: string;
    }>;
    logout(req: Request, res: Response): void;
    get2faQRcode(otpAuthUrl: string): Promise<any>;
    get2faCode(user: User): Promise<any>;
    is2faValid(code: string, user: User): boolean;
    loginWith2fa(user: Partial<User>): Promise<{
        email: string;
        access_token: string;
    }>;
}
