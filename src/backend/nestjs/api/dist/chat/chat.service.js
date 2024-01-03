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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_entity_1 = require("../postgreSQL/entities/chat.entity");
const user_entity_1 = require("../postgreSQL/entities/user.entity");
function createChannelObj(channel, users) {
    const newChannel = new chat_entity_1.ChannelEntity();
    newChannel.name = channel.name;
    newChannel.creatorId = channel.creatorId;
    newChannel.mode = channel.mode;
    newChannel.password = channel.password;
    newChannel.users = users;
    return newChannel;
}
let ChatService = class ChatService {
    constructor(messagesRepository, channelRepository, userRepository) {
        this.messagesRepository = messagesRepository;
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
    }
    async getAllMessages() {
        return await this.messagesRepository.find();
    }
    async getAllMessagesByChannel(channelId) {
        const MessageList = await this.messagesRepository.findBy({ channelId: channelId });
        return MessageList;
    }
    async createMessage(message) {
        this.messagesRepository.create(message);
        return await this.messagesRepository.save(message);
    }
    async getAllChannels() {
        return await this.channelRepository.find();
    }
    async getCurrentUserChannels(userId) {
        return await this.channelRepository
            .createQueryBuilder("channel")
            .innerJoinAndSelect("channel.users", "user", "user.id = :userId", { userId })
            .getMany();
    }
    async createChannel(channel) {
        const users = [];
        for (const idUser of channel.users) {
            const newUser = await this.userRepository.findOneBy({ id: idUser });
            users.push(newUser);
        }
        const newChannel = createChannelObj(channel, users);
        this.channelRepository.create(newChannel);
        return await this.channelRepository.save(newChannel);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.MessageEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.ChannelEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map