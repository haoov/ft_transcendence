import { Controller, Delete, Get, Param, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { AuthentificatedGuard } from "src/auth/guards/auth.AuthentificatedGuard";
import { Request } from "express";

@Controller("user")
@UseGuards(new AuthentificatedGuard())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Get("me")
	getCurrentUser(@Req() req: Request): Promise<User> {
		return this.userService.getUser((req.user as User).email);
	}

	@Delete(":username")
	deleteUser(@Param("username") username: string) {
		this.userService.deleteUser(username);
	}
}