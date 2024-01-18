import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { UserEntity } from "src/postgreSQL/entities/user.entity";
import { User } from "./user.interface";
import { PG_UNIQUE_VIOLATION } from "@drdgvhbh/postgres-error-codes";
import { Request, Response } from "express";
import * as fs from 'fs';
import * as path from 'path';

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
        const updatedUser: User = await this.getUserById(user.id);
        if (updatedUser) {
            updatedUser.status = newStatus;
            this.usersRepository.save(updatedUser as UserEntity);
        }
    }

	async updateUsername(req: Request): Promise<User> {
		const reqUser :User = req.user as User;
		const user: User = await this.usersRepository.findOneBy({ id: reqUser.id }) as User;
		if (!user)
			throw new NotFoundException("User not found in database");
	
		user.username = req.body.username;
		try {
			await this.usersRepository.save(user as UserEntity);
			return user;
		} catch (error) {
			if (error.code === '23505') { // 23505 is the error code for unique_violation in PostgreSQL
				throw new ConflictException('Username is already taken');
			} else {
				throw new InternalServerErrorException('Error');
			}
		}
	}

	async uptadeAvatar(id: number) {
		const user = await this.getUserById(id);

		if (user.avatar.includes(':3000/api/user/avatar/')) {
			// Delete old avatar
			const directoryPath = process.cwd() + '/src/user/avatar-uploads';
			const files = fs.readdirSync(directoryPath);
			const userFiles = files.filter(file => file.startsWith(`avatar-user${id}-`));
			userFiles.sort((a, b) => b.localeCompare(a));
			  for (let i = 1; i < userFiles.length; i++) {
				fs.unlinkSync(path.join(directoryPath, userFiles[i]));
			  }
		}
		else {
			// Updating avatar in database
			user.avatar = `http://${process.env.LOCAL_ADDRESS}:3000/api/user/avatar/${id}`;
			this.usersRepository.save(user as UserEntity);
		}
	}

	getAvatar(id: number, res: Response) {
		const directoryPath = process.cwd() + '/src/user/avatar-uploads';
		const files = fs.readdirSync(directoryPath);
		const userFiles = files.filter(file => file.startsWith(`avatar-user${id}-`));
	  
		// Take the last one
		userFiles.sort();
		const avatar = userFiles[userFiles.length - 1];
	  
		// Return the image file
		res.sendFile(path.join(directoryPath, avatar));
	}
}