/// <reference types="passport" />
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { Request } from "express";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User[]>;
    getCurrentUser(req: Request): Express.User;
    deleteUser(username: string): void;
}
