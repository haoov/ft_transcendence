import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GameService } from "./game.service";
import { Pong } from "./data/Pong";

@WebSocketGateway({ namespace: "game" })
export class GameGateway {
	pong: Pong;

	constructor(private gameService: GameService) {
		this.pong = new Pong();
	}

	@SubscribeMessage("start")
	start(@ConnectedSocket() socket: Socket) {
		this.pong.start();
		socket.emit("started");
	}

	@SubscribeMessage("update")
	update(@ConnectedSocket() socket: Socket) {
		socket.emit("updated", this.pong.update());
	}
};