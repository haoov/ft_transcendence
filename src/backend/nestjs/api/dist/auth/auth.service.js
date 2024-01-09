"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(dto) {
        const user = await this.userService.getUser(dto.email);
        if (!user)
            return await this.userService.createUser(dto);
        return user;
    }
    redirect(code, res) {
        if (!code)
            throw new common_1.ForbiddenException("No code provided");
        res.status(302).redirect("/");
    }
    async login(user) {
        const payload = {
            email: user.email
        };
        return {
            email: payload.email,
            access_token: this.jwtService.sign(payload)
        };
    }
    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(302).redirect("/login");
        });
    }
    async get2faQRcode(otpAuthUrl) {
        return (0, qrcode_1.toDataURL)(otpAuthUrl);
    }
    async get2faSecret(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const optAuthUrl = otplib_1.authenticator.keyuri(user.email, process.env.OTP_NAME, secret);
        await this.userService.set2faSecret(secret, user.email);
        return {
            secret,
            optAuthUrl
        };
    }
    is2faValid(code, user) {
        return otplib_1.authenticator.verify({
            token: code,
            secret: user.twofa_secret,
        });
    }
    async loginWith2fa(user) {
        const payload = {
            email: user.email,
            is_2fa_enabled: !!user.twofa_enabled,
            is_2fa_auth: true,
        };
        return {
            email: payload.email,
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map