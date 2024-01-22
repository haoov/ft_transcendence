<script setup lang="ts">
	import { inject, onBeforeMount, onMounted, ref, watch, type Ref } from 'vue';
	import { Game } from "../game";
	import axios from 'axios';
	import { ClientEvents, ServerEvents, type User } from '@/utils';
	import gameMenu from '@/game/components/gameMenu.vue';
	import score from '@/game/components/score.vue';
	import spells from '@/game/components/spells.vue';
	import SocketManager from '@/SocketManager';
	import { onBeforeRouteLeave } from 'vue-router';
	import type { GameParams } from '../interfaces';

	const socketManager: SocketManager = inject('socketManager') as SocketManager;

	let game: Game;

	const state = ref("noGame");
	const displayMenu = ref(true);
	const difficulty = ref("");
	const p1 = ref({username: "Player1", avatar: "", score: 0});
	const p2 = ref({username: "Player2", avatar: "", score: 0});
	const spellsOn: Ref<boolean[]> = ref([false, false, false, false]);
	const winner = ref("");
	const initParams = (await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/game/params`)).data;

	watch(socketManager.getGameState(), (newVal) => {
		console.log("user status changed: " + newVal);
		if (newVal == "waiting" || newVal == "playing") {
			state.value = newVal;
		}
	})

	function assignMode(gameParams: GameParams) {
		difficulty.value = gameParams.difficulty;
		socketManager.selectParams(gameParams);
	}

	function moveEvents(event: KeyboardEvent) {
		if (event.key == "w" || event.key == "W")
			socketManager.move("up");
		if (event.key == "s" || event.key == "S")
			socketManager.move("down");
		if (event.key == "1")
			socketManager.useSpell("fire");
		if (event.key == "2")
			socketManager.useSpell("ice");
		if (event.key == "3")
			socketManager.useSpell("small");
		if (event.key == "4")
			socketManager.useSpell("big");
	}

	function animate() {
		requestAnimationFrame(animate);
		if (game.hasStarted() && socketManager.getUser().status != "finished") {
			socketManager.update();
			game.renderer.render(game.scene, game.camera);
		}
	}

	const startGame = (users: User[], params: any) => {
		p1.value.username = users[0].username;
		p1.value.avatar = users[0].avatar;
		if (users.length > 1) {
			p2.value.username = users[1].username;
			p2.value.avatar = users[1].avatar;
		}
		else {
			p2.value.username = "Computer" + ": " + difficulty.value;
		}
		game.createField(initParams.params.FIELD_WIDTH, initParams.params.FIELD_HEIGHT, params.map);
		game.started = true;
		displayMenu.value = false;
		animate();
	};

	const updateGame = (data: any) => {
		game.update(data);
		p1.value.score = data.p1Score;
		p2.value.score = data.p2Score;
		if (socketManager.getUser().username == p1.value.username)
			spellsOn.value = data.p1Spells;
		else
			spellsOn.value = data.p2Spells;
	};

	const finishGame = (winnerUsername: string) => {
		console.log("game finished");
		displayMenu.value = true;
		winner.value = winnerUsername;
		game.stopGame();
		state.value = "finished";
	};

	onMounted(() => {
		game = new Game("game", initParams);
		document.addEventListener("keydown", moveEvents);
		if (!socketManager.hasEventListener("game", ServerEvents.gameReady))
			socketManager.addEventListener("game", ServerEvents.gameReady, () => {
				state.value = "ready";
			});
		if (!socketManager.hasEventListener("game", ServerEvents.started))
			socketManager.addEventListener("game", ServerEvents.started, startGame);
		if (!socketManager.hasEventListener("game", ServerEvents.updated))
			socketManager.addEventListener("game", ServerEvents.updated, updateGame);
		if (!socketManager.hasEventListener("game", ServerEvents.finished))
			socketManager.addEventListener("game", ServerEvents.finished, finishGame);
	})

	onBeforeRouteLeave(() => {
		console.log("leaving game");
		if (game && game.hasStarted()) {
			socketManager.forfeit();
			game.stopGame();
		}
		document.removeEventListener("keydown", moveEvents);
	})
</script>

<template>
	<div class="game-container">
		<score
			:p1="p1"
			:p2="p2"
			:state="state"
			v-on:leaveGame="() => {state = 'noGame'}">
		</score>
		<div id="game">
			<gameMenu
				v-if="displayMenu"
				v-on:click="assignMode"
				:state="state"
				:winner="winner"
				v-on:newGame="() => {state = 'noGame';}"
			></gameMenu>
		</div>
		<spells :spellsOn="spellsOn"></spells>
	</div>

	<video
		id="video"
		playinline
		webkit-playsinline
		muted
		loop
		autoplay
		width="720"
		height="480"
		src="../../assets/videos/space.mp4"
		style="display: none;"
	></video>
</template>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	canvas {
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
	}

	#game {
		display: flex;
		width: 720px;
		height: 480px;
	}
</style>