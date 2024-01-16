<script setup lang="ts">
import { inject, onBeforeMount, onMounted, ref } from 'vue';
import { Game } from "../game/game";
import axios from 'axios';
import { ClientEvents, ServerEvents } from '@/utils';
import gameMenu from '@/game/components/gameMenu.vue';
import score from '@/game/components/score.vue';
import spells from '@/game/components/spells.vue';
import GameSocket from '@/game/gameSocket';
import { onBeforeRouteLeave } from 'vue-router';

const gameSocket: GameSocket = inject('gameSocket') as GameSocket;

const displayMenu = ref(true);
const map = ref("random");
const difficulty = ref("");
const p1 = ref({username: "Player1", avatar: "", score: 0, spells: [false, false, false, false]});
const p2 = ref({username: "Player2", avatar: "", score: 0, spells: [false, false, false, false]});
const winner = ref("");
const initParams = (await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/game/params`)).data;

function assignMode(gameParams: {game: string, mode: string, difficulty: string, map: string}) {
	difficulty.value = gameParams.difficulty;
	map.value = gameParams.map;
	gameSocket.getSocket().emit(ClientEvents.gameParams, gameParams);
}

onBeforeMount(() => {})

onMounted(() => {
	const game: Game = new Game("game", initParams);

	if (!gameSocket.moveEventsSet()) {
		document.addEventListener("keydown", (event) => {
				if (event.key == "w" || event.key == "W")
					gameSocket.getSocket().emit(ClientEvents.move, "up");
				if (event.key == "s" || event.key == "S")
					gameSocket.getSocket().emit(ClientEvents.move, "down");
				if (event.key == "1")
					gameSocket.getSocket().emit(ClientEvents.useSpell, "fire");
				if (event.key == "2")
					gameSocket.getSocket().emit(ClientEvents.useSpell, "ice");
				if (event.key == "3")
					gameSocket.getSocket().emit(ClientEvents.useSpell, "small");
				if (event.key == "4")
					gameSocket.getSocket().emit(ClientEvents.useSpell, "big");
			});
		gameSocket.setMoveEvents(true);
	}
	gameSocket.getSocket().on(ServerEvents.started, (users: any, params: any) => {
		console.log("game started");
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
		gameSocket.setUserState("playing");
		displayMenu.value = false;
		animate();
	});
	gameSocket.getSocket().on(ServerEvents.updated, (data) => {
		console.log("game updated");
		displayMenu.value = false;
		game.update(data);
		p1.value.score = data.p1Score;
		p2.value.score = data.p2Score;
		p1.value.spells = data.p1Spells;
		p2.value.spells = data.p2Spells;
	});
	gameSocket.getSocket().on(ServerEvents.finished, (winnerUsername) => {
		gameSocket.setUserState("finished");
		displayMenu.value = true;
		winner.value = winnerUsername;
		game.stopGame();
	});

	function animate() {
		requestAnimationFrame(animate);
		if (game.hasStarted() && gameSocket.getUserState() != "finished") {
			gameSocket.getSocket().emit(ClientEvents.update);
			game.renderer.render(game.scene, game.camera);
		}
	}

	onBeforeRouteLeave(() => {
		console.log("leaving game");
		game.stopGame();
		gameSocket.getSocket().off(ServerEvents.updated);
		gameSocket.getSocket().off(ServerEvents.started);
		gameSocket.getSocket().off(ServerEvents.finished);
	})
})
</script>

<template>
	<score :p1="p1" :p2="p2"></score>
	<div id="game">
		<gameMenu
			v-if="displayMenu"
			v-on:click="assignMode"
			v-on:stopWaiting="gameSocket.stopWaiting()"
			:state="gameSocket.getUserState()"
			:winner="winner"
		></gameMenu>
	</div>
	<spells
		:p1Spells="p1.spells"
		:p2Spells="p2.spells"
		v-on:useSpell="(spell) => {gameSocket.getSocket().emit('useSpell', spell)}"
	></spells>

	<video
		id="video"
		playinline
		webkit-playsinline
		muted
		loop
		autoplay
		width="720"
		height="480"
		src="../assets/videos/space.mp4"
		style="display: none;"
	></video>
</template>

<style>
	canvas {
		border-radius: 1rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
	}

	#game {
		display: flex;
		width: 720px;
		height: 480px;
	}
</style>