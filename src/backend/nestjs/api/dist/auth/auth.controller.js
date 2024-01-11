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
const auth_Intra42Guard_1 = require("./intra42/auth.Intra42Guard");
const auth_AuthentificatedGuard_1 = require("./guards/auth.AuthentificatedGuard");
const user_service_1 = require("../user/user.service");
const auth_Authentificated2faGuard_1 = require("./guards/auth.Authentificated2faGuard");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    checkAuth() { }
    async login(res) {
        return res;
    }
    async redirect(res) {
        res.status(302).redirect("/");
    }
    async get2FA(req) {
        const user = req.user;
        return await this.userService.getUser(user.email);
    }
    async swithOn2fa(req, body) {
        const user = req.user;
        const isCodeValid = this.authService.is2faValid(body.twofaCode, user);
        if (!isCodeValid)
            throw new common_1.UnauthorizedException('Wrong Auth Code');
        await this.userService.set2faMode(user.email, true);
    }
    async generateQRCode(res, req) {
        const user = req.user;
        const { optAuthUrl } = await this.authService.get2faSecret(user);
        return res.json(await this.authService.get2faQRcode(optAuthUrl));
    }
    async authentificate(req, body) {
        const user = req.user;
        const isCodeValid = this.authService.is2faValid(body.twofaCode, user);
        if (!isCodeValid)
            throw new common_1.UnauthorizedException('Wrong Auth Code');
        user.twofa_auth = true;
        return { "message": "2fa logged" };
    }
    async random() {
        return { 'message': `logged with 2fa` };
    }
    async reset(req) {
        const user = req.user;
        user.twofa_auth = false;
        await this.userService.set2faMode(user.email, false);
        return "2fa reset";
    }
    logout(req, res) {
        this.authService.logout(req, res);
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
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)("2fa"),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "get2FA", null);
__decorate([
    (0, common_1.Post)('2fa/turn-on'),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "swithOn2fa", null);
__decorate([
    (0, common_1.Get)('2fa/generate'),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateQRCode", null);
__decorate([
    (0, common_1.Post)('2fa/authentificate'),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authentificate", null);
__decorate([
    (0, common_1.Get)("2fa/test"),
    (0, common_1.UseGuards)(auth_Authentificated2faGuard_1.Authentificated2faGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "random", null);
__decorate([
    (0, common_1.Get)('2fa/reset'),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reset", null);
__decorate([
    (0, common_1.Get)("logout"),
    (0, common_1.UseGuards)(auth_AuthentificatedGuard_1.AuthentificatedGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map