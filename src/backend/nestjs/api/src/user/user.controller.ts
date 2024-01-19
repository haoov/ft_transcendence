import { Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { AuthentificatedGuard } from "src/auth/guards/auth.AuthentificatedGuard";
import { Request, Response } from "express";
import { multerConfig } from "src/user/config/multer.config";
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
	uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) : Promise<User> {
		const user = req.user as User;
		return this.userService.uptadeAvatar(user.id);
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