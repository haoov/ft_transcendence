export interface User {
	id: number,
	username: string,
	avatar: string,
	twofa_enabled: boolean,
	email: string,
	status: string,
}