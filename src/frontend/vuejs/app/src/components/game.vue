<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Game } from "../game/game";
import axios from 'axios';
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from '@/utils';
import gameMenu from '@/game/components/gameMenu.vue';
import score from '@/game/components/score.vue';
import spells from '@/game/components/spells.vue';
import { onBeforeRouteLeave } from 'vue-router';

const state = ref("");
const displayMenu = ref(true);
const map = ref("random");
const difficulty = ref("");
const p1 = ref({username: "Player1", avatar: "", score: 0, spells: [false, false, false, false]});
const p2 = ref({username: "Player2", avatar: "", score: 0, spells: [false, false, false, false]});
const winner = ref("");
const initParams = (await axios.get("http://localhost:3000/api/game/params")).data;
const socket: Socket = io("http://localhost:3000/game");

function assignMode(gameParams: {game: string, mode: string, difficulty: string, map: string}) {
	difficulty.value = gameParams.difficulty;
	map.value = gameParams.map;
	socket.emit("gameParams", gameParams);
}

function stopWait() {
	socket.emit("stopWaiting");
	state.value = "";
}

await axios.get("http://localhost:3000/api/user/me").then((response) => {
		socket.emit(ClientEvents.connected, response.data);
});

socket.on(ServerEvents.waiting, () => {
	state.value = "waiting";
});

socket.on(ServerEvents.finished, (winnerUsername) => {
	state.value = "finished";
	displayMenu.value = true;
	winner.value = winnerUsername;
});

onMounted(() => {
	const game: Game = new Game("game", initParams);

	document.addEventListener("keydown", (event) => {
		if (event.key == "w" || event.key == "W")
			socket.emit("move", "up");
		if (event.key == "s" || event.key == "S")
			socket.emit("move", "down");
		if (event.key == "1")
			socket.emit("useSpell", "fire");
		if (event.key == "2")
			socket.emit("useSpell", "ice");
		if (event.key == "3")
			socket.emit("useSpell", "small");
		if (event.key == "4")
			socket.emit("useSpell", "big");
	})

	socket.on("started", (users: any, params: any) => {
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
		state.value = "playing";
		displayMenu.value = false;
	})

	socket.on("updated", (data) => {
		game.update(data);
		p1.value.score = data.p1Score;
		p2.value.score = data.p2Score;
		p1.value.spells = data.p1Spells;
		p2.value.spells = data.p2Spells;
	});

	function animate() {
		requestAnimationFrame(animate);
		if (game.hasStarted() && state.value != "finished")
			socket.emit("update");
		game.renderer.render(game.scene, game.camera);
	}

	animate();
})

onBeforeRouteLeave(() => {
	socket.disconnect();
})
</script>

<template>
	<score :p1="p1" :p2="p2"></score>
	<div id="game">
		<gameMenu
			v-if="displayMenu == true"
			v-on:click="assignMode"
			v-on:stopWaiting="stopWait"
			:state="state"
			:winner="winner"
		></gameMenu>
	</div>
	<spells
		:p1Spells="p1.spells"
		:p2Spells="p2.spells"
		v-on:useSpell="(spell) => {socket.emit('useSpell', spell)}"
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