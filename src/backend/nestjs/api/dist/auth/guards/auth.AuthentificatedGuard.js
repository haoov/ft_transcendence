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
exports.AuthentificatedGuard = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/user.service");
let AuthentificatedGuard = class AuthentificatedGuard {
    constructor(userService) {
        this.userService = userService;
    }
    ;
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            console.log("user is null");
            return request.isAuthenticated();
        }
        const userDB = await this.userService.getUser(user.email);
        if (userDB.twofa_enabled == false) {
            console.log("2fa is false");
            return true;
        }
        if (userDB.twofa_code == userDB.twofa_secret) {
            console.log("nice code");
            return true;
        }
        console.log(`${userDB.twofa_code} == ${userDB.twofa_secret}`);
        return false;
    }
};
exports.AuthentificatedGuard = AuthentificatedGuard;
exports.AuthentificatedGuard = AuthentificatedGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthentificatedGuard);
//# sourceMappingURL=auth.AuthentificatedGuard.js.map