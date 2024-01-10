"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const entities_1 = require("./entities");
exports.databaseConfig = {
    type: "postgres",
    host: "postgresql",
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [entities_1.UserEntity, entities_1.GameEntity],
    synchronize: true,
};
//# sourceMappingURL=database.config.js.map