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

	getUserById(id: number): Promise<User> {
		return this.usersRepository.findOneBy({ id: id }) as Promise<User>;
	}

	getUserByUsername(username: string): Promise<User> {
		return this.usersRepository.findOneBy({ username: username }) as Promise<User>;
	}

	getUserByEmail(email: string): Promise<User> {
		return this.usersRepository.findOneBy({ email: email }) as Promise<User>;
	}
	
	getAllUsers(): Promise<User[]> {
		return this.usersRepository.find() as Promise<User[]>;
	}

	async	getCurrentUser(req: Request): Promise<User> {
		const reqUser: User = req.user as User;
		return await this.usersRepository.findOneBy({ id: reqUser.id });
	}

	async	createUser(user: User): Promise<User> {
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

	async	set2faSecret(id: number, secret: string): Promise<User> {
		try {
			const user: UserEntity = await this.getUserById(id) as UserEntity;
			user.twofa_secret = secret;
			return this.usersRepository.save(user);
		} catch (err) {
			throw err;
		}
	}

	async	set2faMode(id: number, mode: boolean) {
		try {
			const user: User = await this.getUserById(id);
			user.twofa_enabled = mode;
			return this.usersRepository.save(user);
		} catch (err) {
			throw err;
		}
	}

	async	deleteUser(username: string) {
		const user: User = await this.usersRepository.findOneBy({ username: username }) as User;
		if (!user)
			throw new NotFoundException("User not found in database");
		this.usersRepository.remove(user as UserEntity);
	}

	async updateUserStatus(user: User, newStatus: string) {
		const updatedUser: User = await this.getUserById(user.id);
		if (updatedUser) {
				updatedUser.status = newStatus;
				user = updatedUser;
				await this.usersRepository.save(updatedUser as UserEntity);
		}
		return updatedUser;
	}

	async	updateUsername(req: Request): Promise<User> {
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

	async	uptadeAvatar(id: number): Promise<User> {
		const user = await this.getUserById(id);
		if (!user)
			throw new NotFoundException("User not found in database");
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
		return user;
	}

	getAvatar(id: number, res: Response) {
		const directoryPath = process.cwd() + '/src/user/avatar-uploads';
		const files = fs.readdirSync(directoryPath);
		const userFiles = files.filter(file => file.startsWith(`avatar-user${id}-`));
		if (!userFiles)
			throw new NotFoundException("No custom avatar uploaded");
	  
		// Take the last one
		userFiles.sort();
		const avatar = userFiles[userFiles.length - 1];
	  
		// Return the image file
		if (!avatar)
			throw new NotFoundException("No custom avatar uploaded");
		res.sendFile(path.join(directoryPath, avatar));
	}

	async	blockUser(userId: number, blockedId: number): Promise<User> {
		if (userId === blockedId)
			throw new ForbiddenException("You can't block yourself");
		const user = await this.usersRepository.findOne({where : { id: userId },  relations: ['users_blocked']});
		const blocked = await this.usersRepository.findOne({where : { id: blockedId }});
		if (!user || !blocked)
			throw new NotFoundException("User not found in database");
		user.users_blocked.push(blocked);;
		await this.usersRepository.save(user);
		return blocked;
	}

	async	unblockUser(userId: number, blockedId: number): Promise<User> {
		if (userId === blockedId)
			throw new ForbiddenException("You can't unblock yourself");
		const user = await this.usersRepository.findOne({where : { id: userId },  relations: ['users_blocked']});
		if (!user)
			throw new NotFoundException("User not found in database")
		user.users_blocked = user.users_blocked.filter(user => user.id != blockedId);
		await this.usersRepository.save(user);
		return await this.usersRepository.findOne({where : { id: blockedId }});
	}

	// Users blocked by the user with id idUser
	async	getBlockedUsers(idUser: number): Promise<number[]> {
		const user: UserEntity = await this.usersRepository.findOne({ where : { id: idUser }, relations: ["users_blocked"]}) as UserEntity;
		if (!user)
			throw new NotFoundException("User not found in database");
		return user.users_blocked.map((user) => user.id);
	}

	// Users blocking the user with id idUser
	async	getBlockingList(idUser: number): Promise<number []> {
		const blockingList = await this.usersRepository
		.createQueryBuilder('user')
		.innerJoin('user.users_blocked', 'blockedUser')
		.where('blockedUser.id = :userId', { userId: idUser })
		.getMany()

		if (!blockingList)
			throw new NotFoundException("User not found in database");
		const blockingListIds = blockingList.map((user) => user.id);
	
		return blockingListIds;
	}

	async addFriend(user1Id: number, user2Id: number): Promise<boolean> {
		const user1 = await this.usersRepository.findOne({where : { id: user1Id },  relations: ['friends']});
		const user2 = await this.usersRepository.findOne({where : { id: user2Id },  relations: ['friends']});
		if (!user1 || !user2)
			throw new NotFoundException("User not found in database");
		user1.friends.push(user2);
		await this.usersRepository.save(user1);
		return user2.friends.some(friend => friend.id == user1Id);
	}

	async deleteFriend(user1Id: number, user2Id: number) {
		const user1 = await this.usersRepository.findOne({where : { id: user1Id },  relations: ['friends']});
		const user2 = await this.usersRepository.findOne({where : { id: user2Id },  relations: ['friends']});
		if (!user1 || !user2)
			throw new NotFoundException("User not found in database");
		user1.friends = user1.friends.filter(friend => friend.id != user2Id);
		user2.friends = user2.friends.filter(friend => friend.id != user1Id);
		await this.usersRepository.save([user1, user2]);
	}

	async getMutualFriendList(userId: number): Promise<number[]> {
		const user = await this.usersRepository.findOne({where : { id: userId },  relations: ['friends']});
		if (!user)
			throw new NotFoundException("User not found in database");

		const mutualFriends = await Promise.all(
		  user.friends.map(async friend => {
			const friendEntity = await this.usersRepository.findOne({where : { id: friend.id },  relations: ['friends']});
			if (!friendEntity)
				throw new NotFoundException("User not found in database");
			return friendEntity.friends.some(friendOfFriend => friendOfFriend.id == userId) ? friendEntity.id : null;
		  })
		);
	  
		return mutualFriends.filter(friend => friend != null);
	}

	async	getFriendAndPendingList(idUser: number): Promise<number []> {
		const user: UserEntity = await this.usersRepository.findOne({ where : { id: idUser }, relations: ["friends"]});
		if (!user)
			throw new NotFoundException("User not found in database");
		return user.friends.map((user) => user.id);
	}

}