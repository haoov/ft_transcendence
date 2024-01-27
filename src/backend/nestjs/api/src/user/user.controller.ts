import { Body, Controller, Delete, Get, Param, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { Request, Response } from "express";
import { multerConfig } from "src/user/config/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserGateway } from "./user.gateway";
import Jwt2faGuard from "src/auth/jwt-2fa/jwt-2fa.guard";
import { UserEntity } from "src/postgreSQL/entities";
import { updateUsernameDto } from "./dto/updateUsername.dto";

@Controller("user")
@UseGuards(Jwt2faGuard)
export class UserController {
	constructor(private readonly userService: UserService,
				private readonly userGateway: UserGateway) {}

	@Get()
	getUser(@Query("username") username: string, @Query("id") id: number): Promise<User> {
		if (id)
			return this.userService.getUserById(id);
		else if (username)
			return this.userService.getUserByUsername(username);
		return null;
	}

	@Get("all")
	getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Get("me")
	async getCurrentUser(@Req() req: Request): Promise<User> {
		const user: UserEntity = await this.userService.getCurrentUser(req) as UserEntity;
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;
	}
	
	@Get("block")
	getBlockedUsers(@Req() req: Request): Promise<User[]> {
		const user = req.user as User;
		return this.userService.getBlockedUsers(user.id);
	}

	@Get("blockedBy")
	isBlocked(@Param("id") id: number, @Req() req: Request): Promise<number []> {
		const user = req.user as User;
		return this.userService.getBlockingList(user.id);
	}

	@Put('update/username')
	async updateUsername(@Req() req: Request, @Body() body: updateUsernameDto): Promise<User> {
		const user = await this.userService.updateUsername(req);
		this.userGateway.dataChanged(user);
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;
	}

	@Put('update/avatar')
	@UseInterceptors(FileInterceptor('avatar', multerConfig))
	async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) : Promise<User> {
		let user = req.user as User;
		user = await this.userService.uptadeAvatar(user.id);
		this.userGateway.dataChanged(user);
		const { twofa_secret, ...user_ret } = user;
		return user_ret as User;
	}

	@Put('friend/add')
	async addFriend(@Req() req: Request, @Query("id") friendId: number): Promise <boolean> {
		const user = req.user as User;
		const areMutualFriends = await this.userService.addFriend(user.id, friendId);
		this.userGateway.dataChanged(user);
		return areMutualFriends;
	}
	
	@Put('friend/delete')
	async deleteFriend(@Req() req: Request, @Query("id") friendId: number) {
		const user = req.user as User;
		await this.userService.deleteFriend(user.id, friendId);
		this.userGateway.dataChanged(user);
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