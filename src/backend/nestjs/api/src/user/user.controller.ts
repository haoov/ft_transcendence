import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.interface";
import { AuthentificatedGuard } from "src/auth/guards/auth.AuthentificatedGuard";
import { Request } from "express";
import { multerConfig } from "src/config/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("user")
@UseGuards(new AuthentificatedGuard())
export class UserController {
	constructor(private readonly userService: UserService) {}

    @Get()
    getUser(@Query("username") username: string, @Query("id") id: number): Promise<User> {
        //console.log(username);
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
	getCurrentUser(@Req() req: Request): Express.User {
		return this.userService.getCurrentUser(req);
	}
	
	@Get("block")
	getBlockedUsers(@Req() req: Request): Promise<User[]> {
		const user = req.user as User;
		return this.userService.getBlockedUsers(user.id);
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