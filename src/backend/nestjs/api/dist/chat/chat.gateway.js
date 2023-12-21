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
function buildMsg(senderName, profilePic, message) {
    return {
        sender: {
            name: senderName,
            avatar: profilePic,
        },
        message: {
            text: message.text,
            time: message.timestamp,
        }
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
        });
    }
    async onNewMessage(message) {
        const sender = await this.userService.getUserById(message.senderId);
        this.server.emit('newMessage', buildMsg(sender.username, sender.avatar, message));
        this.chatService.createMessage(message);
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
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_service_1.UserService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map