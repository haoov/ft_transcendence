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
exports.UserGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../postgreSQL/entities/user.entity");
const userStatus_enum_1 = require("./enum/userStatus.enum");
const enum_1 = require("../game/enum");
let UserGateway = class UserGateway {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.clients = [];
    }
    async handleConnection(client) {
        client.on(enum_1.clientEvents.connected, async (data) => {
            client.data.user = data;
            this.clients.push(client);
            try {
                const user = await this.usersRepository.findOneBy({ email: data.email });
                if (user.status === userStatus_enum_1.userStatus.undefined || user.status === userStatus_enum_1.userStatus.offline) {
                    user.status = userStatus_enum_1.userStatus.online;
                    await this.usersRepository.save(user);
                }
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    async handleDisconnect(client) {
        try {
            if (client.data.user) {
                const windows = this.clients.filter((socket) => socket.data.id === client.data.id);
                if (windows.length === 1) {
                    const user = await this.usersRepository.findOneBy({ email: client.data.user.email });
                    user.status = userStatus_enum_1.userStatus.offline;
                    await this.usersRepository.save(user);
                }
            }
            for (let i = 0; i < this.clients.length; i++) {
                if (this.clients[i] === client) {
                    this.clients.splice(i, 1);
                    break;
                }
            }
        }
        catch (err) {
            throw err;
        }
        ;
    }
};
exports.UserGateway = UserGateway;
exports.UserGateway = UserGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'connect' }),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserGateway);
//# sourceMappingURL=user.gateway.js.map