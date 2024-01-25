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
		if (user)
			return user;
		throw new NotFoundException("User not found");
	}

	@Get("all")
	getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Get("me")
	async getCurrentUser(@Req() req: Request): Promise<User> {
		const user: UserEntity = await this.userService.getCurrentUser(req) as UserEntity;
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;
	}
	
	@Get("block")
	getBlockedUsers(@Req() req: Request): Promise<User[]> {
		const user = req.user as User;
		return this.userService.getBlockedUsers(user.id);
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
		return user;
	}

	@Put('update/avatar')
	@UseInterceptors(FileInterceptor('avatar', multerConfig))
	async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) : Promise<User> {
		let user = req.user as User;
		user = await this.userService.uptadeAvatar(user.id);
		this.userGateway.dataChanged(user);
		return user;
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