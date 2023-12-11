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
exports.ChatGateway = void 0;
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const user_service_1 = require("../user/user.service");
const websockets_1 = require("@nestjs/websockets");
const ADMIN_NAME = 'Admin';
function buildMsg(senderName, message) {
    return {
        senderName: senderName,
        text: message.message,
        time: message.timestamp,
    };
}
;
let ChatGateway = class ChatGateway {
    constructor(chatService, userService) {
        this.chatService = chatService;
        this.userService = userService;
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('New connection');
        });
    }
    async onNewMessage(data) {
        const message = {
            senderId: data.senderId,
            channelId: data.channelId,
            message: data.message,
            datestamp: new Date(),
            timestamp: Date.now(),
        };
        const sender = await this.userService.getUserById(data.senderId);
        const messageCreated = await this.chatService.createMessage(message);
        this.server.emit('onMessage', buildMsg(sender.username, messageCreated));
    }
    async onJoinchannel(socket, data) {
        socket.join(data.channelId);
        const messages = await this.chatService.getAllMessagesByChannel(data.channelId);
        for (const message of messages) {
            const sender = await this.userService.getUserById(message.senderId);
            socket.emit('message', buildMsg(sender.username, message));
        }
    }
    onLeavechannel(socket, data) {
        socket.leave(data.channelId);
    }
    async onCreateChannel(socket, data) {
        const channel = {
            name: data.name,
            creatorId: data.creatorId,
            modeChanel: data.modeChanel,
        };
        const channelCreated = await this.chatService.createChannel(channel);
    }
    async onEditChannel(socket, data) {
        const channel = {
            name: data.name,
            modeChanel: data.modeChanel,
        };
        const channelEdited = await this.chatService.saveChannel(data.editorId, data.channelId, channel);
    }
    async onDeleteChannel(socket, data) {
        const channelDeleted = await this.chatService.deleteChannel(data.channelId, data.userId);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('newMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onNewMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinchannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onJoinchannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leavechannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "onLeavechannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onCreateChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('editChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onEditChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onDeleteChannel", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_service_1.UserService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map