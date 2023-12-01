import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getTodo() {
		return "Todo: login and register";
	}
}
