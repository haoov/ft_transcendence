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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../postgreSQL/entities");
const typeorm_2 = require("typeorm");
let HomeService = class HomeService {
    constructor(userRepository, gameRepository) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }
    async getLeaderboard() {
        let userStats = await this.getAllUserStats();
        return userStats.slice(0, 5);
    }
    async getOneUserStats(username) {
        const userStats = await this.getAllUserStats();
        const target = userStats.filter((user) => {
            return user.username === username;
        });
        if (target.length)
            return target[0];
        else
            return null;
    }
    async getAllUserStats() {
        const usersWithGames = await this.userRepository.find({
            relations: ['games_won', 'games_lost'],
        });
        const userStats = usersWithGames.map((user) => {
            const game_count = user.games_won.length + user.games_lost.length;
            let rate;
            if (game_count)
                rate = Math.round((user.games_won.length / game_count) * 100);
            else
                rate = 0;
            return {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                wins: user.games_won.length,
                win_rate: rate,
                games: game_count,
                rank: 0
            };
        });
        userStats.sort((a, b) => b.wins - a.wins || b.win_rate - a.win_rate || a.id - b.id);
        userStats.forEach((user, index) => {
            user.rank = index + 1;
        });
        return userStats;
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.GameEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], HomeService);
//# sourceMappingURL=home.service.js.map