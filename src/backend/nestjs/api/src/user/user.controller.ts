import { Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { AuthentificatedGuard } from "src/auth/guards/auth.AuthentificatedGuard";
import { Request } from "express";
import { multerConfig } from "src/config/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("user")
@UseGuards(new AuthentificatedGuard())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Get("me")
	getCurrentUser(@Req() req: Request): Express.User {
		return this.userService.getCurrentUser(req);
	}

	@Get(":id")
	getUser(@Param("id") id: number): Promise<User> {
		return this.userService.getUserById(id);
	}

	@Put('update/username')
	updateUsername(@Req() req: Request): Promise<User> {
		return this.userService.updateUsername(req);
	}

	@Put('update/avatar')
	@UseInterceptors(FileInterceptor('avatar', multerConfig))
	uploadAvatar(@UploadedFile() file: Express.Multer.File) {
		console.log('uploadAvatar');
	}

	@Delete(":username")
	deleteUser(@Param("username") username: string) {
		this.userService.deleteUser(username);
	}
}