import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { AuthentificatedGuard } from "src/auth/guards/auth.AuthentificatedGuard";
import { Request } from "express";

@Controller("user")
@UseGuards(AuthentificatedGuard)
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