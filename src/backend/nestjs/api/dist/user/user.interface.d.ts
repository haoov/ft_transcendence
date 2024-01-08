export interface User {
    username: string;
    avatar: string;
    email: string;
    twofa_secret: string;
    twofa_enabled: boolean;
}
