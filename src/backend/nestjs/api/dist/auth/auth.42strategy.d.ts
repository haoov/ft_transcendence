import { Profile } from "passport-42";
import { AuthService } from "./auth.service";
declare const Auth42Strategy_base: new (...args: any[]) => any;
export declare class Auth42Strategy extends Auth42Strategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accesToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};
