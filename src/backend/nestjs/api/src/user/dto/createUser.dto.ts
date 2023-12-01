import { IsEmail, IsNotEmpty } from "class-validator";

export class createUserDto {
	@IsNotEmpty()
	userName: string;
	@IsEmail()
	email: string;
}