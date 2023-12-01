import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
	type: "postgres",
	host: "postgresql",
	port: 5432,
	username: process.env.$POSTGRES_USER,
	password: process.env.$POSTGRES_PASSWORD,
	database: process.env.$POSTGRES_DB,
	entities: []
};