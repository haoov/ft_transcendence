/// <reference types="passport" />
import { Repository } from 'typeorm';
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { User } from "./user.interface";
import { Request } from "express";
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    getUser(email: string): Promise<User>;
    getUserById(id: number): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getCurrentUser(req: Request): Express.User;
    createUser(user: User): Promise<User>;
    deleteUser(username: string): Promise<void>;
}
