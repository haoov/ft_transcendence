import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserAuthDTO {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	avatar: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;
}