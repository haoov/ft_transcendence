import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { Request } from "express";
import Jwt2faGuard from "src/auth/jwt-2fa/jwt-2fa.guard";
import { UserEntity } from "src/postgreSQL/entities";

@Controller("user")
@UseGuards(Jwt2faGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getAllUsers(): Promise<User[]> {
		const users: User[] = await this.userService.getAllUsers();
		// const users_ret = users.map(user => {
		// 	const { twofa_secret, ...user_ret } = user;
		// 	return user_ret;
		// });
		return users as User[];
	}

	@Get("me")
	async getCurrentUser(@Req() req: Request): Promise<User> {
		const user: UserEntity = await this.userService.getCurrentUser(req) as UserEntity;
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;
	}

	@Get(":id")
	async getUser(@Param("id") id: number): Promise<User> {
		const user: UserEntity = await this.userService.getUserById(id) as UserEntity;
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;
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