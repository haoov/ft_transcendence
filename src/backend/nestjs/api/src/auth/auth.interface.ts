import { User } from "src/user/user.interface";

export interface TokenPayload {
	id: number;
	twofaAuth?: boolean;
}

export interface UserValidate {
	user: User,
	first_connection: boolean,
}