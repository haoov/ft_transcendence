import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MessageEntity, ChannelEntity } from './entities/chat.entity';

export const databaseConfig: TypeOrmModuleOptions = {
	type: "postgres",
	host: "postgresql",
	port: 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [UserEntity, MessageEntity, ChannelEntity],
	//!Do not use in production use migrations instead
	synchronize: true,
};