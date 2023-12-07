import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { AuthentificatedGuard } from "src/auth/guards/auth.AuthentificatedGuard";

@Controller("user")
@UseGuards(new AuthentificatedGuard())
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