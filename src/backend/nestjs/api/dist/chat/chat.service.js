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
let ChatService = class ChatService {
    constructor(messagesRepository, channelRepository) {
        this.messagesRepository = messagesRepository;
        this.channelRepository = channelRepository;
    }
    async getAllMessagesByChannel(channelId) {
        const MessageList = await this.messagesRepository.find();
        return MessageList.filter((message) => { message.channelId === channelId; });
    }
    async createMessage(message) {
        return await this.messagesRepository.create(message);
    }
    async saveMessage(message) {
        return await this.messagesRepository.save(message);
    }
    async getAllChanel() {
        return await this.channelRepository.find();
    }
    async createChannel(channel) {
        const channelList = await this.channelRepository.find();
        if (!channel.name || !channel.creatorId || !channel.modeChanel)
            return null;
        else if (channelList.find((channel) => channel.name === channel.name))
            return null;
        return await this.channelRepository.create(channel);
    }
    async saveChannel(idEditor, idChannel, channel) {
        const channelToEdit = await this.channelRepository.findOneBy({ id: idChannel });
        if (!channelToEdit)
            return null;
        if (idEditor != channelToEdit.creatorId)
            return null;
        channelToEdit.name = channel.name;
        channelToEdit.modeChanel = channel.modeChanel;
        return await this.channelRepository.save(channelToEdit);
    }
    async deleteChannel(idChannel, idUser) {
        const channelToDelete = await this.channelRepository.findOneBy({ id: idChannel });
        if (!channelToDelete)
            return null;
        if (channelToDelete.creatorId != idUser)
            return null;
        return await this.channelRepository.delete(idChannel);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.MessageEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.ChannelEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map