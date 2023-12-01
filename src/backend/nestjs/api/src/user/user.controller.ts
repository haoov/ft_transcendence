import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { createUserDto } from "./dto/createUser.dto";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Post()
	createUser(@Body() userData: createUserDto): Promise<User> {
		return this.userService.createUser(userData as User) as Promise<User>;
	}
}