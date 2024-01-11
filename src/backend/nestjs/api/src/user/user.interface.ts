export interface User {
	username: string;
	avatar: string;
	email: string;
	twofa_secret: string;
	twofa_enabled: boolean;
	twofa_auth: boolean;
}

export interface Body2faDTO {
	twofaCode: string
};