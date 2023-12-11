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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_Intra42Guard_1 = require("./guards/auth.Intra42Guard");
const auth_AuthentificatedGuard_1 = require("./guards/auth.AuthentificatedGuard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    checkAuth() { }
    async login(response) {
        return response;
    }
    async redirect(code, res) {
        this.authService.redirect(code, res);
    }
    async get2FA(response) {
        return response;
    }
    logout(req, res) {
        this.authService.logout(req, res);
    }
    async random(req) {
        const user = req.user;
        await this.authService.sendEmail(user.email);
        return { 'message': `email sent to ${user.email}` };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "checkAuth", null);
__decorate([
    (0, common_1.Get)("login"),
    (0, common_1.UseGuards)(auth_Intra42Guard_1.Intra42Guard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)("42-redirect"),
    (0, common_1.UseGuards)(auth_Intra42Guard_1.Intra42Guard),
    __param(0, (0, common_1.Query)("code")),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)("2fa"),
    (0, common_1.UseGuards)(auth_Intra42Guard_1.Intra42Guard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "get2FA", null);
__decorate([
    (0, common_1.Get)("logout"),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("test"),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "random", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map