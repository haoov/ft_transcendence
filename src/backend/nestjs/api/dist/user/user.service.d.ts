import { Repository } from 'typeorm';
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { User } from "./user.interface";
import { Request } from "express";
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    getUserById(id: number): Promise<User>;
    getUser(email: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getCurrentUser(req: Request): Promise<User>;
    createUser(user: User): Promise<User>;
    deleteUser(username: string): Promise<void>;
    updateUserStatus(user: User, newStatus: string): Promise<void>;
}
