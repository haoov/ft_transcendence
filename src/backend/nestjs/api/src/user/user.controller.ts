import { Controller, Delete, Get, NotFoundException, Param, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { Request, Response } from "express";
import { multerConfig } from "src/user/config/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserGateway } from "./user.gateway";
import Jwt2faGuard from "src/auth/jwt-2fa/jwt-2fa.guard";
import { UserEntity } from "src/postgreSQL/entities";

@Controller("user")
@UseGuards(Jwt2faGuard)
export class UserController {
	constructor(private readonly userService: UserService,
				private readonly userGateway: UserGateway) {}

	@Get()
	async getUser(@Query("username") username: string, @Query("id") id: number): Promise<User> {
		let user: User;
		if (id)
			user = await this.userService.getUserById(id);
		else if (username)
			user = await this.userService.getUserByUsername(username);
		if (user) {
			const { twofa_secret, ...user_ret } = user;
			return user_ret as User;
		}
		throw new NotFoundException("User not found");
	}

	@Get("all")
	async getAllUsers(): Promise<User[]> {
		const users: User[] = await this.userService.getAllUsers();
		
		const ret_users = users.map(user => {
			const { twofa_secret, ...user_ret } = user;
			return user_ret as User;
		  });
		  
		  return ret_users;
	}

	@Get("me")
	async getCurrentUser(@Req() req: Request): Promise<User> {
		const user: UserEntity = await this.userService.getCurrentUser(req) as UserEntity;
		
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;
	}
	
	@Get("block")
	async getBlockedUsers(@Req() req: Request): Promise<User[]> {
		const user = req.user as User;
		const users = await this.userService.getBlockedUsers(user.id);

		const ret_users = users.map(user => {
			const { twofa_secret, ...user_ret } = user;
			return user_ret as User;
		});
		
		return ret_users;
	}

	@Get("blockedBy")
	isBlocked(@Param("id") id: number, @Req() req: Request): Promise<number []> {
		const user = req.user as User;
		return this.userService.getBlockingList(user.id);
	}

	@Put('update/username')
	async updateUsername(@Req() req: Request): Promise<User> {
		const user = await this.userService.updateUsername(req);
		this.userGateway.dataChanged(user);
		
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;

	}

	@Put('update/avatar')
	@UseInterceptors(FileInterceptor('avatar', multerConfig))
	async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) : Promise<User> {
		let user = req.user as User;
		user = await this.userService.uptadeAvatar(user.id);
		this.userGateway.dataChanged(user);
		
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;
	}

	@Get('avatar/:id')
	getAvatar(@Param('id') id: number, @Res() res: Response) {
		return this.userService.getAvatar(id, res);
	}

	@Delete(":username")
	deleteUser(@Param("username") username: string) {
		this.userService.deleteUser(username);
	}
}