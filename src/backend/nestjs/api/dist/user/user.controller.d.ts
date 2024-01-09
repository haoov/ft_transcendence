import { UserService } from "./user.service";
import { User } from "./user.interface";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User[]>;
}
