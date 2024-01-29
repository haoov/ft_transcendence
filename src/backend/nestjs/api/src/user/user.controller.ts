import { Body, Controller, Delete, Get, Param, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { Request, Response } from "express";
import { multerConfig } from "src/user/config/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserGateway } from "./user.gateway";
import Jwt2faGuard from "src/auth/jwt-2fa/jwt-2fa.guard";
import { UserEntity } from "src/postgreSQL/entities";
import { updateUsernameDto } from "./dto/updateUsername.dto";

@Controller("user")
@UseGuards(Jwt2faGuard)
export class UserController {
	constructor(private readonly userService: UserService,
				private readonly userGateway: UserGateway) {}

	@Get()
	async getUser(@Query("username") username: string, @Query("id") id: number): Promise<User> {
		try {
			let user: User;
			if (id)
				user = await this.userService.getUserById(id);
			else if (username)
				user = await this.userService.getUserByUsername(username);
			if (!user)
				return null;
			const { twofa_secret, ...user_ret } = user;
			return user_ret as User;
		}
		catch (err) {
			throw err;
		}
	}

	@Get("all")
	async getAllUsers(): Promise<User[]> {
		try {
			const users = await this.userService.getAllUsers()
			return users.map(({ twofa_secret, ...user_ret }) => user_ret);
		}
		catch (err) {
			throw err;
		}
	}

	@Get("me")
	async getCurrentUser(@Req() req: Request): Promise<User> {
		try {
			const user: UserEntity = await this.userService.getCurrentUser(req) as UserEntity;
			const { twofa_secret, ...user_ret } = user;
			return user_ret as User;
		}
		catch (err) {
			throw err;
		
		}
	}
	
	@Get("block")
	async getBlockedUsers(@Req() req: Request): Promise<User[]> {
		try {
			const user = req.user as User;
			const blocked = await this.userService.getBlockedUsers(user.id);
			return blocked.map(({ twofa_secret, ...user_ret }) => user_ret);
		}
		catch (err) {
			throw err;
		}
	}

	@Get("blockedBy")
	isBlocked(@Param("id") id: number, @Req() req: Request): Promise<number []> {
		try {
			const user = req.user as User;
			return this.userService.getBlockingList(user.id);
		}
		catch (err) {
			throw err;
		}
	}

	@Put('update/username')
	async updateUsername(@Req() req: Request, @Body() body: updateUsernameDto): Promise<User> {
		try {
			const user = await this.userService.updateUsername(req);
			this.userGateway.dataChanged(user);
			const { twofa_secret, ...user_ret } = user;
			return user_ret as User;
		}
		catch (err) {
			throw err;
		}
	}

	@Put('update/avatar')
	@UseInterceptors(FileInterceptor('avatar', multerConfig))
	async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) : Promise<User> {
		try {
			let user = req.user as User;
			user = await this.userService.uptadeAvatar(user.id);
			this.userGateway.dataChanged(user);
			const { twofa_secret, ...user_ret } = user;
			return user_ret as User;
		}
		catch (err) {
			throw err;
		}
	}

	@Put('friend/add')
	async addFriend(@Req() req: Request, @Query("id") friendId: number): Promise <boolean> {
		try {
			const user = req.user as User;
			const areMutualFriends = await this.userService.addFriend(user.id, friendId);
			this.userGateway.dataChanged(user);
			return areMutualFriends;
		}
		catch (err) {
			throw err;
		}
	}
	
	@Put('friend/delete')
	async deleteFriend(@Req() req: Request, @Query("id") friendId: number) {
		try {
			const user = req.user as User;
			await this.userService.deleteFriend(user.id, friendId);
			this.userGateway.dataChanged(user);
		}
		catch (err) {
			throw err;
		}
	}

	@Get('avatar/:id')
	getAvatar(@Param('id') id: number, @Res() res: Response) {
		try {
			return this.userService.getAvatar(id, res);
		}
		catch (err) {
			throw err;
		}
	}

	@Delete(":username")
	deleteUser(@Param("username") username: string) {
		try {
			this.userService.deleteUser(username);
		}
		catch (err) {
			throw err;
		}
	}
}