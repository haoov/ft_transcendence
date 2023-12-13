"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const chat_gateway_1 = require("./chat.gateway");
const chat_service_1 = require("./chat.service");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("../postgreSQL/entities/chat.entity");
const user_entity_1 = require("../postgreSQL/entities/user.entity");
const chat_controller_1 = require("./chat.controller");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chat_entity_1.MessageEntity, chat_entity_1.ChannelEntity, user_entity_1.UserEntity])],
        providers: [chat_gateway_1.ChatGateway, chat_service_1.ChatService, user_service_1.UserService],
        controllers: [chat_controller_1.ChatController],
    })
], ChatModule);
;
//# sourceMappingURL=chat.modules.js.map