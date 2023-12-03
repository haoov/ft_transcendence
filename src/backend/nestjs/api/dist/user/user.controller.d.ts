import { UserService } from "./user.service";
import { User } from "./user.interface";
import { createUserDto } from "./dto/createUser.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User[]>;
    createUser(userData: createUserDto): Promise<User>;
}
