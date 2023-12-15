<script setup lang="ts">
import { onMounted } from 'vue';
import { Game } from "../game/game"
import axios from 'axios';
import io from "socket.io-client"
import { Socket } from "socket.io-client"

const socket: Socket = io("http://localhost:3000/game");
const currentUser = await axios.get("http://localhost:3000/api/user").then((response) => {
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

	socket.on("updated", (data) => {game.update(data)});

	function animate() {
		requestAnimationFrame(animate);
		socket.emit("update");
		game.effect.rotateX(0.01);
		game.effect.rotateY(0.01);
		game.effect.rotateZ(0.01);
		game.renderer.render(game.scene, game.camera);
	}
	animate();
})
</script>

<template>
	<div id="game"></div>
</template>

<style>
	#title_test {
		color: var(--c-black);
	}

	#game {
		width: 720px;
		height: 480px;
		border: solid var(--c-black);
	}
</style>