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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const user_service_1 = require("../user/user.service");
;
function convertRawMessagesToMessages(messagesRaw, users) {
    let messages = [];
    for (const message of messagesRaw) {
        const user = users.find((user) => { return user.id === message.senderId; });
        let messageConverted = {
            sender: {
                name: user?.username,
                avatar: user?.avatar,
            },
            message: {
                text: message.text,
                time: message.timestamp,
            }
        };
        messages.push(messageConverted);
    }
    return messages;
}
let ChatController = class ChatController {
    constructor(chatService, userService) {
        this.chatService = chatService;
        this.userService = userService;
    }
    async getAllMessages() {
        const users = await this.userService.getAllUsers();
        const messagesRaw = await this.chatService.getAllMessages();
        const messages = convertRawMessagesToMessages(messagesRaw, users);
        return messages;
    }
    async getAllMessagesByChannel(idChannel) {
        const users = await this.userService.getAllUsers();
        const messagesRaw = await this.chatService.getAllMessagesByChannel(parseInt(idChannel));
        const messages = convertRawMessagesToMessages(messagesRaw, users);
        return messages;
    }
    async getAllChannels() {
        return await this.chatService.getAllChannels();
    }
    async getChannelById(id) {
        return await this.chatService.getChannelById(parseInt(id));
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('/messages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllMessages", null);
__decorate([
    (0, common_1.Get)('messages/:idChannel'),
    __param(0, (0, common_1.Param)('idChannel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllMessagesByChannel", null);
__decorate([
    (0, common_1.Get)('/Channels'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllChannels", null);
__decorate([
    (0, common_1.Get)('/Channels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChannelById", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_service_1.UserService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map