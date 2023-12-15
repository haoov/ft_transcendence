import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { User } from "src/user/user.interface";

@WebSocketGateway({ namespace: "game" })
export class GameGateway {
	constructor(private gameService: GameService) {}

	// @SubscribeMessage("update")
	// update(@ConnectedSocket() socket: Socket) {
	// 	socket.emit("updated", this.gameService.update());
	// }
};