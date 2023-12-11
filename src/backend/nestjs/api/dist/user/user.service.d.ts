import { Repository } from 'typeorm';
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { User } from "./user.interface";
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    getUser(email: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    createUser(user: User): Promise<User>;
    add2FACode(email: string, code: string): Promise<User>;
    deleteUser(username: string): Promise<void>;
}
