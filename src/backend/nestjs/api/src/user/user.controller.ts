import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Delete(":username")
	deleteUser(@Param("username") username: string) {
		this.userService.deleteUser(username);
	}
}