"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("../user/user.module");
const user_entity_1 = require("../postgreSQL/entities/user.entity");
const passport_1 = require("@nestjs/passport");
const auth_intra42Strategy_1 = require("./intra42/auth.intra42Strategy");
const auth_sessionSerializer_1 = require("./auth.sessionSerializer");
const throttler_1 = require("@nestjs/throttler");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            passport_1.PassportModule.register({ session: true }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 6000,
                    limit: 10,
                }])
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            auth_intra42Strategy_1.Auth42Strategy,
            auth_sessionSerializer_1.SessionSerializer
        ]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map