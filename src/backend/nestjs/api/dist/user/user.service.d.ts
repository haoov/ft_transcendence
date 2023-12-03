import { Repository } from 'typeorm';
import { UserEntity } from "src/typeOrm/entities/user.entity";
import { User } from "./user.interface";
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    getAllUsers(): Promise<User[]>;
    createUser(userData: User): Promise<User>;
}
