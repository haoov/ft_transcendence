export interface UserRelation {
	id: number;
	username: string;
	avatar: string;
	status: string;
	email: string;
	blocking: boolean;
	blocked: boolean;
	friend: boolean | string;
}