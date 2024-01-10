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
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const enum_1 = require("./enum");
const Room_1 = require("./classes/Room");
const user_service_1 = require("../user/user.service");
const userStatus_enum_1 = require("../user/enum/userStatus.enum");
const game_service_1 = require("./game.service");
let GameGateway = class GameGateway {
    constructor(userService, gameService) {
        this.userService = userService;
        this.gameService = gameService;
        this.rooms = [];
        this.roomId = 0;
    }
    handleConnection(client) {
        client.on(enum_1.clientEvents.connected, (data) => {
            client.data.user = data;
            console.log("user connected: ", client.data.user);
            const room = this.findRoom(client);
            if (room) {
                if (room.isFull()) {
                    client.emit(enum_1.serverEvents.started, room.getUsers(), room.getParams());
                }
                room.addSocket(client);
            }
        });
    }
    async handleDisconnect(client) {
        if (client.data.user) {
            console.log("disconnect user: ", client.data.user);
            const room = this.findRoom(client);
            if (room) {
                room.removeSocket(client);
                if (!room.checkSockets(client.data.user)) {
                    if (room.isFull()) {
                        room.quitGame(client);
                    }
                    this.deleteRoom(room);
                    await this.userService.updateUserStatus(client.data.user, userStatus_enum_1.userStatus.undefined);
                }
            }
        }
    }
    async manageRooms(client, params) {
        const openRoom = this.rooms.find((room) => {
            return (room.isOpen() && room.getParams().game == params.game);
        });
        if (openRoom) {
            openRoom.addSocket(client);
            this.closeRoom(openRoom);
        }
        else {
            const newRoom = this.createRoom(params, client.data.user);
            newRoom.addSocket(client);
            if (params.mode == "singlePlayer") {
                this.closeRoom(newRoom);
            }
            else {
                await this.userService.updateUserStatus(client.data.user, userStatus_enum_1.userStatus.waiting);
                client.emit(enum_1.serverEvents.waiting);
            }
        }
    }
    update(client) {
        const room = this.findRoom(client);
        if (room) {
            const update = room.getGameUpdate();
            this.server.to(room.getName()).emit(enum_1.serverEvents.updated, update);
            if (update.finished) {
                this.deleteRoom(room);
            }
        }
    }
    move(client, direction) {
        const room = this.findRoom(client);
        if (room) {
            room.gameMove(client, direction);
        }
    }
    async stopWaiting(client) {
        const room = this.findRoom(client);
        room.getSockets().forEach((socket) => { socket.data.room = ""; });
        await this.userService.updateUserStatus(client.data.user, userStatus_enum_1.userStatus.undefined);
    }
    findRoom(client) {
        return this.rooms.find((room) => {
            return (room.getUsers().find((user) => {
                return (user.id == client.data.user.id);
            }));
        });
    }
    createRoom(params, p1) {
        const newRoom = new Room_1.Room(this.roomId.toString(), params, p1);
        ++this.roomId;
        this.rooms.push(newRoom);
        console.log("new room");
        return newRoom;
    }
    closeRoom(room) {
        console.log("closing room");
        room.getUsers().forEach(async (user) => {
            await this.userService.updateUserStatus(user, userStatus_enum_1.userStatus.playing);
        });
        room.startGame();
        this.server.to(room.getName()).emit(enum_1.serverEvents.started, room.getUsers(), room.getParams());
    }
    deleteRoom(room) {
        console.log("deleting room: " + room.getName());
        this.server.to(room.getName()).emit(enum_1.serverEvents.finished, room.getWinner().username);
        this.gameService.createGame(room.getStats());
        room.getSockets().forEach(async (socket) => {
            await this.userService.updateUserStatus(socket.data.user, userStatus_enum_1.userStatus.undefined);
        });
        this.rooms.splice(this.rooms.indexOf(room), 1);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('gameParams'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "manageRooms", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(enum_1.clientEvents.update),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "update", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('move'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "move", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stop_wait'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "stopWaiting", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'game' }),
    __metadata("design:paramtypes", [user_service_1.UserService, game_service_1.GameService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map