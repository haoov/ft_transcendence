<script setup lang="ts">
	import { onMounted, ref, watch, type Ref, onUnmounted } from 'vue';
	import { ServerEvents, type User } from '@/utils';
	import gameMenu from '@/game/components/gameMenu.vue';
	import score from '@/game/components/score.vue';
	import spells from '@/game/components/spells.vue';
	import { socketManager } from '@/SocketManager';
	import { onBeforeRouteLeave } from 'vue-router';
	import gameData from '@/game/gameData';

	const width: Ref<number> = ref(window.innerWidth * 0.8);
	const height: Ref<number> = ref(width.value * 0.5625);

	function resize() {
		if (window.innerWidth * 0.8 > 1280) {
			console.log("resize error");
			return ;
		}
		console.log("resize");
		width.value = window.innerWidth * 0.8;
		height.value = width.value * 0.5625;
		gameData.resize(width.value, height.value);
	};

	onMounted(() => {
		window.addEventListener("resize", () => {resize();});
	});

	onUnmounted(() => {
		window.removeEventListener("resize", () => {resize();});
	});

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
		if (gameData.started()) {
			console.log("animate");
			socketManager.emit("game", "needUpdate");
			socketManager.update();
			gameData.render();
			requestAnimationFrame(animate);
		}
	}

	onMounted(async () => {
		
		await gameData.createRenderer("game", width.value, height.value);
		document.addEventListener("keydown", moveEvents);
		socketManager.checkGame();
		if (!socketManager.hasEventListener("game", ServerEvents.gameReady))
			socketManager.addEventListener("game", ServerEvents.gameReady, () => {
				gameData.setGameState("ready");
			});
		if (!socketManager.hasEventListener("game", ServerEvents.started)) {
			socketManager.addEventListener("game", ServerEvents.started, (users: User[], data: any) => {
				gameData.startGame(users, data);
				requestAnimationFrame(animate);
			});
		}
		if (!socketManager.hasEventListener("game", ServerEvents.updated)) {
			socketManager.addEventListener("game", ServerEvents.updated, (data: any) => {
				gameData.updateGame(data, width.value, height.value);
			});
		}
		if (!socketManager.hasEventListener("game", ServerEvents.finished))
			socketManager.addEventListener("game", ServerEvents.finished, (winner: string) => {
				gameData.finishGame(winner);
			});
	})

	onBeforeRouteLeave(() => {
		console.log("leaving game");
		if (gameData.started()) {
			socketManager.forfeit();
		}
		document.removeEventListener("keydown", moveEvents);
	})
</script>

<template>
	<div class="game-container"
		:width="width"
		:height="height">
		<score></score>
		<div id="game">
			<gameMenu
				v-if="gameData.getDisplayMenu().value"
				:width="width"
				:height="height">
			</gameMenu>
		</div>
		<spells></spells>
	</div>

	<video
		id="video"
		playinline
		webkit-playsinline
		muted
		loop
		autoplay
		:width="width"
		:height="height"
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
		align-items: center;
		justify-content: center;
	}
</style>