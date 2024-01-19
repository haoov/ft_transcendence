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

	getUserByUsername(username: string): Promise<User> {
		return this.usersRepository.findOneBy({ username: username }) as Promise<User>;
	}

	getUser(email: string): Promise<User> {
		return this.usersRepository.findOneBy({ email: email }) as Promise<User>;
	}
	
	getAllUsers(): Promise<User[]> {
		return this.usersRepository.find() as Promise<User[]>;
	}

	async getCurrentUser(req: Request): Promise<User> {
		const reqUser :User = req.user as User;
		try {
			const user: User = await this.usersRepository.findOneBy({ email: reqUser.email });
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

	async deleteUser(username: string) {
		const user: User = await this.usersRepository.findOneBy({ username: username }) as User;
		if (!user)
			throw new NotFoundException("User not found in database");
		this.usersRepository.remove(user as UserEntity);
	}


	async updateUserStatus(user: User, newStatus: string) {
		if (user) {
			user.status = newStatus;
			this.usersRepository.save(user as UserEntity);
		}
	}

	async blockUser(idUser: number, idUserToBlock: number) {
		if (idUser === idUserToBlock)
			throw new ForbiddenException("You can't block yourself");
		const user: UserEntity = await this.usersRepository.findOne({ where : { id: idUser }, relations: ["users_blocked"]}) as UserEntity;
		const userToBlock: UserEntity = await this.usersRepository.findOne({ where : { id: idUserToBlock }}) as UserEntity;
		if (!user || !userToBlock)
			throw new NotFoundException("User not found in database");
		user.users_blocked.push(userToBlock);
		await this.usersRepository.save(user);
	}

	async unblockUser(idUser: number, idUserToUnblock: number) {
		const user: UserEntity = await this.usersRepository.findOne({ where : { id: idUser }, relations: ["users_blocked"]}) as UserEntity;
		const userToUnblock: UserEntity = await this.usersRepository.findOne({ where : { id: idUserToUnblock }}) as UserEntity;
		if (!user || !userToUnblock)
			throw new NotFoundException("User not found in database");
		user.users_blocked.splice(user.users_blocked.indexOf(userToUnblock), 1);
		await this.usersRepository.save(user);
	}

	async getBlockedUsers(idUser: number): Promise<User[]> {
		const user: UserEntity = await this.usersRepository.findOne({ where : { id: idUser }, relations: ["users_blocked"]}) as UserEntity;
		if (!user)
			throw new NotFoundException("User not found in database");
		return user.users_blocked;
	}
}