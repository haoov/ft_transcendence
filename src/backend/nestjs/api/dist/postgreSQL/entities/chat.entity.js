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
exports.ChannelEntity = exports.MessageEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let ChannelEntity = class ChannelEntity {
};
exports.ChannelEntity = ChannelEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChannelEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChannelEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChannelEntity.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChannelEntity.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChannelEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ChannelEntity.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MessageEntity, message => message.channel),
    __metadata("design:type", Array)
], ChannelEntity.prototype, "messages", void 0);
exports.ChannelEntity = ChannelEntity = __decorate([
    (0, typeorm_1.Entity)()
], ChannelEntity);
let MessageEntity = class MessageEntity {
};
exports.MessageEntity = MessageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MessageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MessageEntity.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MessageEntity.prototype, "channelId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], MessageEntity.prototype, "datestamp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MessageEntity.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ChannelEntity, channel => channel.messages),
    __metadata("design:type", ChannelEntity)
], MessageEntity.prototype, "channel", void 0);
exports.MessageEntity = MessageEntity = __decorate([
    (0, typeorm_1.Entity)()
], MessageEntity);
//# sourceMappingURL=chat.entity.js.map