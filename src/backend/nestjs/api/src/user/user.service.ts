import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { UserEntity } from "src/typeOrm/entities/user.entity";
import { User } from "./user.interface";

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {}

	getAllUsers(): Promise<User[]> {
		return this.usersRepository.find() as Promise<User[]>;
	}

	createUser(userData: User): Promise<User> {
		return this.usersRepository.save(userData as UserEntity) as Promise<User>;
	}
}