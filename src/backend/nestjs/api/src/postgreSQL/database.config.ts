import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity, GameEntity, MessageEntity, ChannelEntity  } from './entities';

export const databaseConfig: TypeOrmModuleOptions = {
	type: "postgres",
	host: "postgresql",
	port: 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [UserEntity, GameEntity, MessageEntity, ChannelEntity],
	synchronize: true,
};