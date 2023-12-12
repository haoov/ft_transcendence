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
const axios_1 = require("axios");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.eu.mailgun.org",
    port: 587,
    auth: {
        user: "postmaster@42.hololive.fr",
        pass: process.env.MAILGUN_KEY,
    },
});
let AuthService = class AuthService {
    constructor(userService) {
        this.userService = userService;
    }
    async validateUser(dto) {
        const user = await this.userService.getUser(dto.email);
        if (!user)
            return await this.userService.createUser(dto);
        return user;
    }
    redirect(code, req, res) {
        if (!code)
            throw new common_1.ForbiddenException("No code provided");
        const user = req.user;
        if (user.twofa_enabled == true) {
            this.sendEmail(user.email);
            return res.status(302).redirect("/api/auth/2fa");
        }
        return res.status(302).redirect("/");
    }
    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(302).redirect("/login");
        });
    }
    async getRandomCode() {
        const opts = {
            "jsonrpc": "2.0",
            "method": "generateStrings",
            "params": {
                "apiKey": process.env.RANDOM_ORG_KEY,
                "n": 8,
                "length": 6,
                "characters": "0123456789",
                "replacement": true
            },
            "id": 42
        };
        try {
            const res = await axios_1.default.post("https://api.random.org/json-rpc/4/invoke", opts);
            return res.data.result.random.data[0];
        }
        catch (err) {
            throw err;
        }
    }
    async sendEmail(email) {
        try {
            const code = await this.getRandomCode();
            await this.userService.add2faSecret(email, code);
            console.log(`${code} was sent to ${email}`);
        }
        catch (err) {
            throw err;
        }
    }
    async switch_twofa(email) {
        try {
            this.userService.switch_twofa(email);
        }
        catch (err) {
            throw err;
        }
    }
    async setup_2fa(email, code) {
        try {
            this.userService.setup_2fa(email, code);
            console.log(`2fa code set to ${code}`);
        }
        catch (err) {
            throw err;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map