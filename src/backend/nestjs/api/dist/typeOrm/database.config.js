"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const user_entity_1 = require("./entities/user.entity");
exports.databaseConfig = {
    type: "postgres",
    host: "postgresql",
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [user_entity_1.UserEntity],
    synchronize: true,
};
//# sourceMappingURL=database.config.js.map