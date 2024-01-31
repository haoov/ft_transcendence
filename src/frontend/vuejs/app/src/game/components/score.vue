<script setup lang="ts">
	import { inject } from 'vue';
	import { socketManager } from '@/SocketManager';
	import CustumButton from '@/components/custumButton.vue';
	import gameData from '../gameData';

	defineProps(["p1", "p2", "state"]);
	const emit = defineEmits(["leaveGame"]);

	function leaveGame() {
		socketManager.forfeit();
		gameData.setGameState("noGame");
	}

	function iconClass(id: number) {
		let playerAvatar: string;
		if (id == 1)
			playerAvatar = gameData.getPlayer1().value.avatar;
		else
			playerAvatar = gameData.getPlayer2().value.avatar;
		if (playerAvatar.includes("http"))
			return "avatar player";
		else
			return "avatar";
	}
</script>

<template>

<div class="score-container">
		<div class="score-div p2">
			<span class="score p2">{{ gameData.getPlayer2().value.score }}</span>
			<img :class="iconClass(2)" :src="gameData.getPlayer2().value.avatar">
			<span class="username">{{ gameData.getPlayer2().value.username }}</span>
		</div>
		<CustumButton
			v-if="gameData.getGameState().value == 'started'"
			class="leave"
			v-on:click="leaveGame()">
			Leave
		</CustumButton>
		<div class="score-div p1">
			<span class="username">{{ gameData.getPlayer1().value.username }}</span>
			<img :class="iconClass(1)" :src="gameData.getPlayer1().value.avatar">
			<span class="score p1">{{ gameData.getPlayer1().value.score }}</span>
		</div>
	</div>

</template>

<style scoped>
	.score-container {
		display: flex;
		width: 66%;
		border-radius: 5rem;
		background: linear-gradient(to left,var(--c-white),10%, transparent);
		padding: 0px 10px 0px 10px;
		margin-top: 20px;
		margin-bottom: 5px;
		justify-content: space-between;
		align-items: center;
		animation: slide 0.3s ease-in;
		overflow: hidden;
	}

	@keyframes slide {
		0% {
			width: 0%;
		}
		100% {
			width: 720px;
		}
	}

	.score-div {
		display: flex;
		width: 300px;
		align-items: flex-end;
	}

	.score-div.p2 {
		justify-content: flex-start;
	}

	.score-div.p1 {
		justify-content: flex-end;
	}

	.avatar {
		width: 40px;
		height: 40px;
		object-fit: cover;
	}

	.avatar.player {
		border-radius: 50%;
	}

	.username {
		padding: 0px 10px 0px 10px;
	}

	.score {
		font-size: xx-large;
	}

	.score.p1 {
		padding-left: 25px;
	}

	.score.p2 {
		padding-right: 25px;
	}
</style>