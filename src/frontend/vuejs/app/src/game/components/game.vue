<script setup lang="ts">
	import { inject, onMounted } from 'vue';
	import { ServerEvents, type User } from '@/utils';
	import gameMenu from '@/game/components/gameMenu.vue';
	import score from '@/game/components/score.vue';
	import spells from '@/game/components/spells.vue';
	import { type SocketManager } from '@/SocketManager';
	import { onBeforeRouteLeave } from 'vue-router';
	import gameData from '@/game/gameData';

	const socketManager: SocketManager = inject('socketManager') as SocketManager;

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
		if (gameData.started()) {
			socketManager.update();
			gameData.render();
		}
	}

	onMounted(() => {
		gameData.createRenderer("game");
		document.addEventListener("keydown", moveEvents);
		if (!socketManager.hasEventListener("game", ServerEvents.gameReady))
			socketManager.addEventListener("game", ServerEvents.gameReady, () => {
				gameData.setGameState("ready");
			});
		if (!socketManager.hasEventListener("game", ServerEvents.started)) {
			socketManager.addEventListener("game", ServerEvents.started, (users: User[], data: any) => {
				gameData.startGame(users, data);
				animate();
			});
		}
		if (!socketManager.hasEventListener("game", ServerEvents.updated)) {
			socketManager.addEventListener("game", ServerEvents.updated, (data: any) => {
				gameData.updateGame(data);
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
	<div class="game-container">
		<score></score>
		<div id="game">
			<gameMenu v-if="gameData.getDisplayMenu().value"></gameMenu>
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
</style>../gameRenderer