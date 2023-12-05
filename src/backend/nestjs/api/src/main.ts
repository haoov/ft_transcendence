import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.use(session(	{
											secret: 'my-secret',
											resave: false,
											saveUninitialized: false,
										}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.enableCors(	{
										origin: "http://localhost:5173",
										credentials: true
									});
  await app.listen(3000);
}
bootstrap();
