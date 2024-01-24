import { Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { AuthentificatedGuard } from "src/auth/guards/auth.AuthentificatedGuard";
import { Request, Response } from "express";
import { multerConfig } from "src/user/config/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserGateway } from "./user.gateway";

@Controller("user")
@UseGuards(new AuthentificatedGuard())
export class UserController {
	constructor(private readonly userService: UserService,
				private readonly userGateway: UserGateway) {}

	@Get()
	getUser(@Query("username") username: string, @Query("id") id: number): Promise<User> {
		if (id)
			return this.userService.getUserById(id);
		else if (username)
			return this.userService.getUserByUsername(username);
		return null;
	}

	@Get("all")
	getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Get("me")
	getCurrentUser(@Req() req: Request): Express.User {
		return this.userService.getCurrentUser(req);
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