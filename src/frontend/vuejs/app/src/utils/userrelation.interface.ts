export interface UserRelation {
	id: number;
	username: string;
	avatar: string;
	status: string;
	blocking: boolean;
	blocked: boolean;
	friend: boolean | string;
}