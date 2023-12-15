import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { User } from "src/user/user.interface";
import { Pong } from "./data/Pong";

@WebSocketGateway({ namespace: "game" })
export class GameGateway {
	pong: Pong;

	constructor(private gameService: GameService) {
		this.pong = new Pong();
	}

	@SubscribeMessage("update")
	update(@ConnectedSocket() socket: Socket) {
		socket.emit("updated", this.pong.update());
	}
};