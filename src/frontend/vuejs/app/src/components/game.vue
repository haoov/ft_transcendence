<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Game } from "../game/game";
import axios from 'axios';
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from '@/utils';

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

socket.on(ServerEvents.finished, (win: string, p1: number, p2: number) => {
	state.value = "Finished";
});

onMounted(() => {
	const game: Game = new Game("game", initParams);

	game.classicButton.onclick = () => {
		game.scene.remove(game.menu);
		game.scene.add(game.field, game.ball, game.paddle1, game.paddle2);
		socket.emit(ClientEvents.mode, "classic");
	};
	game.superButton.onclick = () => {
		game.scene.remove(game.menu);
		game.scene.add(game.field, game.ball, game.paddle1, game.paddle2);
		socket.emit(ClientEvents.mode, "super");
	};

	document.addEventListener("keydown", (event) => {
		if (event.key == "w")
			socket.emit("move", "up");
		if (event.key == "s")
			socket.emit("move", "down");
	})

	socket.on("started", () => {game.started = true; state.value = "";})

	socket.on("updated", (data) => {console.log("updated"); game.update(data);});

	function animate() {
		requestAnimationFrame(animate);
		if (game.hasStarted())
			socket.emit("update");
		game.renderer.render(game.scene, game.camera);
		game.cssRenderer.render(game.scene, game.camera);
	}

	animate();
})
</script>

<template>
	<h1>{{ state }}</h1>
	<div id="game"></div>
</template>

<style>
	#game {
		display: flex;
		width: 720px;
		height: 480px;
		border: solid var(--c-white);
		justify-content: center;
		align-items: center;
	}

	#mainMenu {
		display: flex;
	}

	.mainMenuButton {
		border: none;
		border-radius: 8px;
		padding: 10px 12px;
		font-size: x-large;
		background-color: var(--c-pink);
		box-shadow: 1px 1px 20px var(--c-pink);
	}
</style>