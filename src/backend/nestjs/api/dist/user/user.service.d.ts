import { Repository } from 'typeorm';
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { User } from "./user.interface";
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    getUser(email: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    createUser(user: User): Promise<User>;
    add2faSecret(email: string, code: string): Promise<User>;
    setup_2fa(email: string, code: string): Promise<User>;
    switch_twofa(email: string): Promise<User & UserEntity>;
    deleteUser(username: string): Promise<void>;
}
