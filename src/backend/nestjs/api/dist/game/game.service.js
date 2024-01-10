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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const fs_1 = require("fs");
const Pong_1 = require("./data/Pong");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../postgreSQL/entities");
const typeorm_2 = require("typeorm");
let GameService = class GameService {
    constructor(userService, gameRepository) {
        this.userService = userService;
        this.gameRepository = gameRepository;
    }
    initParams() {
        return (new Pong_1.Pong({ game: "classic", mode: "singlePlayer", public: true }).initParams());
    }
    getFont() {
        return (0, fs_1.readFileSync)("src/game/data/fonts/helvetiker_regular.typeface.json");
    }
    getTexture(texture) {
        switch (texture) {
            case "ice":
                return (0, fs_1.readFileSync)("src/game/data/textures/ice.color.jpg");
            case "fire":
                return (0, fs_1.readFileSync)("src/game/data/textures/fire.color.png");
            case "tennisCourt":
                return (0, fs_1.readFileSync)("src/game/data/textures/tennis_court.jpeg");
            case "questionMark":
                return (0, fs_1.readFileSync)("src/game/data/textures/questionMark.jpeg");
            case "space":
                return (0, fs_1.readFileSync)("src/game/data/textures/space.jpeg");
            default: break;
        }
    }
    async createGame(game) {
        try {
            this.gameRepository.create(game);
            return this.gameRepository.save(game);
        }
        catch (err) {
            console.log("error in game");
        }
        return null;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.GameEntity)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        typeorm_2.Repository])
], GameService);
;
//# sourceMappingURL=game.service.js.map