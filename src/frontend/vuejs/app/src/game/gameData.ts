import axios from "axios";
import { GameRenderer, type InitParams } from "./gameRenderer";
import type { GamePlayer, GameState } from "./interfaces";
import {
	defaultAvatar,
	fireIcon,
	iceIcon,
	smallIcon,
	bigIcon
} from "@/assets/images/gameIcons";
import { ref, type Ref } from "vue";
import { type User } from "@/utils";
import type { Camera, Scene } from "three";

class GameData {
	private displayMenu: Ref<boolean>;
	private difficulty: Ref<string>;
	private readonly player1: Ref<GamePlayer>;
	private readonly player2: Ref<GamePlayer>;
	private winner: string;
	private opponent: string;
	private initParams: InitParams | null;
	private gameRenderer: GameRenderer | null;
	private gameState: Ref<GameState>;

	constructor() {
		this.gameRenderer = null;
		this.initParams = null;
		this.displayMenu = ref(true);
		this.difficulty = ref("easy");
		this.player1 = ref({
			username: "Player1",
			avatar: defaultAvatar,
			score: 0,
			spells: [
				{ type: "fire", icon: fireIcon, on: false },
				{ type: "ice", icon: iceIcon, on: false },
				{ type: "small", icon: smallIcon, on: false },
				{ type: "big", icon: bigIcon, on: false },
			],
		});
		this.player2 = ref({
			username: "Player2",
			avatar: defaultAvatar,
			score: 0,
			spells: [
				{ type: "fire", icon: fireIcon, on: false },
				{ type: "ice", icon: iceIcon, on: false },
				{ type: "small", icon: smallIcon, on: false },
				{ type: "big", icon: bigIcon, on: false },
			],
		});
		this.winner = "";
		this.opponent = "";
		this.gameState = ref("noGame");
	}

	async createRenderer(id: string) {
		await axios.get<InitParams>(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/game/params`).then(
			(response) => {
				console.log("creating renderer");
				this.initParams = response.data;
				this.gameRenderer= new GameRenderer(id, this.initParams);
			}
		);
	}

	startGame(users: User[], params: any) {
		console.log("game started");
		this.player1.value.username = users[0].username;
		this.player1.value.avatar = users[0].avatar;
		if (users.length > 1) {
			this.player2.value.username = users[1].username;
			this.player2.value.avatar = users[1].avatar;
		}
		else {
			this.player2.value.username = "Computer" + ": " + this.difficulty.value;
			this.player2.value.avatar = defaultAvatar;
		}
		this.gameRenderer?.createField(
			this.initParams!.params.FIELD_WIDTH,
			this.initParams!.params.FIELD_HEIGHT, params.map
		);
		this.displayMenu.value = false;
		this.gameState.value = "started";
	};

	updateGame(data: any) {
		this.gameRenderer?.update(data);
		this.player1.value.score = data.p1Score;
		this.player2.value.score = data.p2Score;
		this.player1.value.spells.forEach((spell, index) => {
			spell.on = data.p1Spells[index];
		});
		this.player2.value.spells.forEach((spell, index) => {
			spell.on = data.p2Spells[index];
		});
	};

	finishGame(winnerUsername: string) {
		console.log("game finished");
		console.log("game finished");
		this.displayMenu.value = true;
		this.winner = winnerUsername;
		this.gameState.value = "finished";
	};

	setDifficulty(difficulty: string) {
		this.difficulty.value = difficulty;
	}

	getGameState(): Ref<GameState> {
		return this.gameState;
	}

	setGameState(state: GameState) {
		this.gameState.value = state;
	}

	started(): boolean {
		return this.gameState.value == "started";
	}

	getPlayer1(): Ref<GamePlayer> {
		return this.player1;
	}

	getPlayer2(): Ref<GamePlayer> {
		return this.player2;
	}

	getDisplayMenu(): Ref<boolean> {
		return this.displayMenu;
	}

	getWinner(): string {
		return this.winner;
	}

	getOpponent(): string {
		return this.opponent;
	}

	setOpponent(opponent: string) {
		this.opponent = opponent;
	}

	render() {
		this.gameRenderer?.renderer?.render(
			this.gameRenderer.scene as Scene,
			this.gameRenderer.camera as Camera);
	}

	getCurrentPlayer(username: string): Ref<GamePlayer> {
		if (username == this.player1.value.username)
			return this.player1;
		else
			return this.player2;
	}
}

const gameData = new GameData();

export default gameData;