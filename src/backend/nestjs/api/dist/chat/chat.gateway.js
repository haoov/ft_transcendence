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
        this.usersSocketList = new Map();
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            let currentChannel = null;
            socket.on('join', (channel) => {
                if (currentChannel) {
                    socket.leave(currentChannel);
                }
                socket.join(channel.id.toString());
                currentChannel = channel.id.toString();
            });
            this.server.emit('NewConnection');
            socket.on('userConnected', (user) => {
                this.usersSocketList.set(user.id, socket);
            });
        });
    }
    async onNewMessage(message) {
        const sender = await this.userService.getUserById(message.senderId);
        this.server.to(message.channelId.toString()).emit('newMessage', buildMsg(sender.username, sender.avatar, message));
        this.chatService.createMessage(message);
    }
    async onNewChannel(channel) {
        const newChannelCreated = await this.chatService.createChannel(channel);
        for (const userId of channel.users) {
            this.usersSocketList.get(userId).emit('newChannelCreated', newChannelCreated);
        }
    }
    async onJoinChannel(channel) {
        const channelToJoin = await this.chatService.getChannelById(channel.id);
        if (channelToJoin.mode === 'private' && channelToJoin.password !== channel.password) {
            this.usersSocketList.get(channel.userId).emit('channelJoined', false);
            return;
        }
        this.usersSocketList.get(channel.userId).emit('channelJoined', true);
        this.usersSocketList.get(channel.userId).emit('newChannelCreated', channelToJoin);
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
    (0, websockets_1.SubscribeMessage)('createNewChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onNewChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onJoinChannel", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_service_1.UserService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map