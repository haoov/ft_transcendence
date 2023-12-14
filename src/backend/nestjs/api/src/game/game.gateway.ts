import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { User } from "src/user/user.interface";

@WebSocketGateway({ namespace: "game" })
export class GameGateway {
	constructor(private gameService: GameService) {}

	handleConnection(@ConnectedSocket() socket: Socket) {
		console.log("new connection", socket.id);
		socket.on("connected", (data) => {
			this.gameService.addPlayer(socket.id, data as User);
		})
	}

	handleDisconnect(@ConnectedSocket() socket: Socket) {
		console.log("disonnected", socket.id);
		this.gameService.reset();
	}

	@SubscribeMessage("move")
	move(@ConnectedSocket() socket: Socket, @MessageBody() direction: string) {
		this.gameService.movePaddle(socket.id, direction);
	}

	@SubscribeMessage("update")
	update(@ConnectedSocket() socket: Socket) {
		socket.emit("updated", this.gameService.update());
	}
};