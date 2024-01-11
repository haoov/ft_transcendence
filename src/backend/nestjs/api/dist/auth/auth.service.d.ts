import { Request, Response } from "express";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";
export declare class AuthService {
    private readonly userService;
    constructor(userService: UserService);
    validateUser(dto: UserAuthDTO): Promise<User>;
    logout(req: Request, res: Response): void;
    get2faQRcode(otpAuthUrl: string): Promise<any>;
    get2faSecret(user: User): Promise<any>;
    is2faValid(code: string, user: User): boolean;
}
