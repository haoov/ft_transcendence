<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Game } from "../game/game";
import axios from 'axios';
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from '@/utils';
import gameMenu from '@/game/components/gameMenu.vue';

let state = ref("");

const socket: Socket = io("http://localhost:3000/game");
const currentUser = await axios.get("http://localhost:3000/api/user/me").then((response) => {
		socket.emit(ClientEvents.connected, response.data);
		return response.data;
	});

const initParams = (await axios.get("http://localhost:3000/api/game/params")).data;

socket.on(ServerEvents.waiting, () => {
	state.value = "Waiting for a game...";
});

socket.on(ServerEvents.finished, () => {
	state.value = "Finished";
});

onMounted(() => {
	const game: Game = new Game("game", initParams);

	document.addEventListener("keydown", (event) => {
		if (event.key == "w" || event.key == "W")
			socket.emit("move", "up");
		if (event.key == "s" || event.key == "S")
			socket.emit("move", "down");
	})

	socket.on("started", () => {game.started = true; state.value = "";})

	socket.on("updated", (data) => {game.update(data);});

	function animate() {
		requestAnimationFrame(animate);
		if (game.hasStarted() && state.value !== "Finished")
			socket.emit("update");
		game.renderer.render(game.scene, game.camera);
	}

	animate();
})
</script>

<template>
	<div id="game">
		<gameMenu></gameMenu>
	</div>
</template>

<style>

	#game {
		display: flex;
		width: 720px;
		height: 480px;
		background: linear-gradient(var(--c-black), var(--c-black)) padding-box,
								linear-gradient(145deg, transparent 35%, var(--c-pink), var(--c-blue-light)) border-box;
		border: 2px solid transparent;
		background-size: 200% 100%;
		animation: gradient 10s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}

		50% {
			background-position: 100% 50%;
		}

		100% {
			background-position: 0% 50%;
		}
	}

</style>