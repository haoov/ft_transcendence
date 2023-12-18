<script setup lang="ts">
import { onMounted } from 'vue';
import { Game } from "../game/game";
import axios from 'axios';
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000/game");
const currentUser = await axios.get("http://localhost:3000/api/user/me").then((response) => {
		socket.emit("connected", response.data);
		return response.data;
	});
const initParams = (await axios.get("http://localhost:3000/api/game/params")).data;

onMounted(() => {
	const game: Game = new Game("game", initParams);

	document.addEventListener("keydown", (event) => {
		if (event.key == "w")
			socket.emit("move", "up");
		if (event.key == "s")
			socket.emit("move", "down");
	})

	socket.on("updated", (data) => {game.update(data);});
	socket.on("started", () => {game.started = true;});

	function animate() {
		requestAnimationFrame(animate);
		if (game.hasStarted())
			socket.emit("update");
		else if (game.launch)
			socket.emit("start");
		game.renderer.render(game.scene, game.camera);
		game.cssRenderer.render(game.scene, game.camera);
	}

	animate();
})
</script>

<template>
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