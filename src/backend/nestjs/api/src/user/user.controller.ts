import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { Request } from "express";
import Jwt2faGuard from "src/auth/jwt-2fa/jwt-2fa.guard";
import { UserAuthDTO } from "./dto/userAuth.dto";

@Controller("user")
@UseGuards(Jwt2faGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getAllUsers(): Promise<User[]> {
		const users: User[] = await this.userService.getAllUsers();
		users.forEach(user => user.twofa_secret = "");
		return users;
	}

	@Get("me")
	async getCurrentUser(@Req() req: Request): Promise<User> {
		const user: User = await this.userService.getCurrentUser(req);
		user.twofa_secret = "";
		return user;
	}

	@Get(":id")
	async getUser(@Param("id") id: number): Promise<User> {
		const user: User = await  this.userService.getUserById(id);
		user.twofa_secret = "";
		return user;
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