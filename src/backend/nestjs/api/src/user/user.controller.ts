import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { Request } from "express";
import { Jwt2faStrategy } from "src/auth/jwt-2fa/jwt-2fa.strategy";

@Controller("user")
@UseGuards(Jwt2faStrategy)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getAllUsers(): Promise<User[]> {
		return await this.userService.getAllUsers();
	}

	@Get("me")
	getCurrentUser(@Req() req: Request): Express.User {
		return this.userService.getCurrentUser(req);
	}

	@Get(":id")
	getUser(@Param("id") id: number): Promise<User> {
		return this.userService.getUserById(id);
	}

	// @Post(':id/upload-avatar')
	// @UseInterceptors(FileInterceptor('avatar', multerConfig))
	// uploadAvatar(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
	//   // Handle the uploaded file, save file details to the database, and delete the old avatar if it exists.
	//   // Return appropriate response.
	// }

	@Delete(":username")
	deleteUser(@Param("username") username: string) {
		this.userService.deleteUser(username);
	}
}