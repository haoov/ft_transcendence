import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { User } from "./user.interface";
import { PG_UNIQUE_VIOLATION } from "@drdgvhbh/postgres-error-codes";
import { Request } from "express";

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {}

	getUser(email: string): Promise<User> {
		return this.usersRepository.findOneBy({ email: email }) as Promise<User>;
	}

	getUserById(id: number): Promise<User> {
		return this.usersRepository.findOneBy({ id: id });
	}
	
	getAllUsers(): Promise<User[]> {
		return this.usersRepository.find() as Promise<User[]>;
	}

	getCurrentUser(req: Request): Express.User {
		return req.user;
	}

	async createUser(user: User): Promise<User> {
		try {
			this.usersRepository.create(user as UserEntity);
			return this.usersRepository.save(user as UserEntity) as Promise<User>;
		}
		catch (err) {
			if (err.code == PG_UNIQUE_VIOLATION)
				throw new ForbiddenException("User already exists");
		}
		return null;
	}

	async deleteUser(username: string) {
		const user: User = await this.usersRepository.findOneBy({ username: username }) as User;
		if (!user)
			throw new NotFoundException("User not found in database");
		this.usersRepository.remove(user as UserEntity);
	}

}