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
        pass: "97b8427ee2308cff00119feb5f389b51-07f37fca-d3cbaaab",
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
    redirect(code, res) {
        if (!code)
            throw new common_1.ForbiddenException("No code provided");
        res.status(302).redirect("/");
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
                "apiKey": "9f00fa84-d677-4b1b-a21e-4a02ed3c094f",
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
            await this.userService.add2FACode(email, code);
            const info = await transporter.sendMail({
                from: '"Transcendence Authentification Process" <2fa@42.hololive.fr>',
                to: "jopadova@student.42.fr ",
                subject: `${code} is your login passcode`,
                text: `${code} is your login passcode`,
                html: `<b>${code} is your login passcode</b>`,
            });
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