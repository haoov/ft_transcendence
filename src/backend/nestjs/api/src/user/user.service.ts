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


	async getUserById(id: number): Promise<User> {
		return this.usersRepository.findOneBy({ id: id }) as Promise<User>;
	}

	getUser(email: string): Promise<User> {
		return this.usersRepository.findOneBy({ email: email }) as Promise<User>;
	}
	
	getAllUsers(): Promise<User[]> {
		return this.usersRepository.find() as Promise<User[]>;
	}

	async getCurrentUser(req: Request): Promise<User> {
		const reqUser: User = req.user as User;
		try {
			const user: User = await this.usersRepository.findOneBy({ id: reqUser.id });
			return user;
		}
		catch (err) {
			throw err;
		};
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

	async set2faSecret(id: number, secret: string): Promise<User> {
		try {
			const user: UserEntity = await this.getUserById(id) as UserEntity;
			user.twofa_secret = secret;
			return this.usersRepository.save(user);
		} catch (err) {
			throw err;
		}
	}

	async set2faMode(id: number, mode: boolean) {
		try {
			const user: User = await this.getUserById(id);
			user.twofa_enabled = mode;
			return this.usersRepository.save(user);
		} catch (err) {
			throw err;
		}
	}

	async deleteUser(username: string) {
		const user: User = await this.usersRepository.findOneBy({ username: username }) as User;
		if (!user)
			throw new NotFoundException("User not found in database");
		this.usersRepository.remove(user as UserEntity);
	}


	async updateUserStatus(user: User, newStatus: string) {
		const updatedUser: User = await this.getUserById(user.id);
		if (updatedUser) {
			updatedUser.status = newStatus;
			this.usersRepository.save(user as UserEntity);
		}
		return updatedUser;
	}
}