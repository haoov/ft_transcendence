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
exports.Auth42Strategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const auth_service_1 = require("./auth.service");
let Auth42Strategy = class Auth42Strategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor(authService) {
        super({
            clientID: process.env.INTRA_CLIENT_ID,
            clientSecret: process.env.INTRA_CLIENT_SECRET,
            callbackURL: process.env.LOCAL_CALLBACK,
            scope: "public"
        });
        this.authService = authService;
    }
    async validate(accesToken, refreshToken, profile) {
        const userInfos = {
            username: profile.username,
            avatar: profile._json.image.link,
            email: profile.emails[0]['value']
        };
        const user = await this.authService.validateUser(userInfos);
        if (!user)
            throw new common_1.UnauthorizedException();
        return user;
    }
};
exports.Auth42Strategy = Auth42Strategy;
exports.Auth42Strategy = Auth42Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], Auth42Strategy);
//# sourceMappingURL=auth.42strategy.js.map