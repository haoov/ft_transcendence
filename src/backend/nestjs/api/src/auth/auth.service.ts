import { ForbiddenException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { UserAuthDTO } from "src/user/dto/userAuth.dto";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async validateUser(dto: UserAuthDTO): Promise<User> {
		const user: User = await this.userService.getUser(dto.email);
		if (!user)
			return await this.userService.createUser(dto as User);
		return user;
	}

	logout(req: Request, res: Response) {
		req.session.destroy(() => {
			res.clearCookie("connect.sid");
			res.status(302).redirect("/api");
		});
	}

	redirect(code: string, res: Response) {
		if (!code)
			throw new ForbiddenException("No code provided");
		res.status(302).redirect("/api/user");
	}

}