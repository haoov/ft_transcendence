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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
let GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    ;
    getInitParams(response) {
        response.send(this.gameService.initParams());
    }
    getFont(response) {
        const file = this.gameService.getFont();
        response.send(file);
    }
    getTexture(texture, response) {
        const file = this.gameService.getTexture(texture);
        response.send(file);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Get)("params"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getInitParams", null);
__decorate([
    (0, common_1.Get)("fonts"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getFont", null);
__decorate([
    (0, common_1.Get)("textures"),
    __param(0, (0, common_1.Query)("texture")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getTexture", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)("game"),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
;
//# sourceMappingURL=game.controller.js.map