<script setup lang="ts">
	import { ref, computed, inject, type Ref } from "vue";
	import loader from "@/components/loader.vue"
	import selector from "@/components/selector.vue"
	import CustumButton from "@/components/custumButton.vue";
	import { socketManager } from "@/SocketManager";
	import type { GameDifficulty, GameMap, GameMode, GameParams, GameType } from "@/game/interfaces";
	import gameData from "../gameData";

	const props = defineProps<{
		width: number,
		height: number
	}>();

	const selectedParams: Ref<GameParams> = ref({
		mode: "classic",
		type: undefined,
		difficulty: "easy",
		map: "classic"
	});

	const modes: GameMode[] = ["classic", "super"];
	const difficulties: GameDifficulty[] = ["easy", "medium", "hard"];
	const types: GameType[] = ["singleplayer", "multiplayer"];
	const maps: GameMap[] = ["classic", "tennis", "space", "random"];

	const isEnabled = computed(() => {
		return (selectedParams.value.type && selectedParams.value.mode);
	});

	function display(what: string): boolean {
		switch (what) {
			case "selectMenu":
				return (gameData.getGameState().value == "noGame");
			case "difficulty":
				return (selectedParams.value.type == "singleplayer");
			case "maps":
				return (selectedParams.value.mode == "super"
								&& selectedParams.value.type == "singleplayer");
			case "waitingMenu":
				return (gameData.getGameState().value == "waiting");
			case "finishedMenu":
				return (gameData.getGameState().value == "finished");
			case "readyMenu":
				return (gameData.getGameState().value == "ready");
			case "playMenu":
				return (gameData.getGameState().value == "play");
			default:
				return false;
		}
	}

	function selectParams(gameParams: GameParams) {
		gameData.setDifficulty(gameParams.difficulty);
		socketManager.selectParams(gameParams);
	}

	function newGame() {
		selectedParams.value.type = undefined
		selectedParams.value.map = "classic";
		selectedParams.value.difficulty = "easy";
		selectedParams.value.mode = "classic";
		gameData.setGameState("noGame");
	}

	function stopWaiting() {
		socketManager.stopWaiting();
		newGame();
	}

	function leaveGame() {
		socketManager.forfeit();
		newGame();
	}

	function getWinner(): string {
		const winner: string = gameData.getWinner();
		if (winner == socketManager.getUser().username)
			return "You";
		else
			return winner;
	}

</script>

<template>
	<!--Menu select params-->
	<div class="menuContainer"
		:width="width"
		:height="height">
		<div id="menu">
			<div id="header">
				<div id="title">Pong</div>
			</div>
			<div v-if="display('selectMenu')" class="menu-box">
				<selector
					label="Mode"
					:values="modes"
					preSelected="classic"
					@select="(value) => {selectedParams.mode = value}"
				></selector>
				<selector
					label="Type"
					:values="types"
					@select="(value) => {selectedParams.type = value}"
				></selector>
				<selector
					v-if="display('difficulty')"
					:label="'Difficulty'"
					:values="difficulties"
					preSelected="easy"
					@select="(value) => {selectedParams.difficulty = value}"
				></selector>
				<selector
					v-if="display('maps')"
					:label="'Map'"
					:values="maps"
					preSelected="classic"
					@select="(value) => {selectedParams.map = value}"
				></selector>
				<div class="button-container">
					<button
						class="v-button"
						id="play"
						:disabled="!isEnabled"
						v-on:click="selectParams(selectedParams)">
						Play
					</button>
				</div>
			</div>

			<!--Menu waiting for opponent-->
			<div v-if="display('waitingMenu')" class="menu-box">
				<loader :text="socketManager.getUser().status"></loader>
				<div class="button-container">
					<button class="v-button" id="stopWaiting" v-on:click="stopWaiting()">
						Stop waiting
					</button>
				</div>
			</div>

			<!--Menu game finished-->
			<div v-if="display('finishedMenu')" class="menu-box">
				<span>{{ getWinner() }} won!</span>
				<div class="button-container">
					<button class="v-button" id="reset" v-on:click="newGame()">
						New game
					</button>
				</div>
			</div>

			<!--Menu game ready-->
			<div v-if="display('readyMenu')" class="menu-box">
				<span>Game ready !</span>
				<loader :text="`Waiting for ${gameData.getOpponent()} response`"></loader>
				<span class="warning">If you chose to leave now, you will forfeit the game</span>
				<div class="button-container">
					<button class="v-button" id="stopWaiting" v-on:click="leaveGame()">
						Leave
					</button>
				</div>
			</div>

			<!--Menu play-->
			<div v-if="display('playMenu')" class="menu-box">
				<span>Opponent found !</span>
				<div class="button-container">
					<button class="v-button" v-on:click="socketManager.play()">
						Play
					</button>
					<button class="v-button" v-on:click="socketManager.forfeit()">
						Forfeit
					</button>
				</div>
			</div>
		</div>
	</div>

</template>

<style scoped>
	.menuContainer {
		position: absolute;
		background: transparent;
		backdrop-filter: blur(3px);
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	#menu {
		display: flex;
		flex-direction: column;
		padding: 20px 30px;
		gap: 20px;
		border-radius: 0.8rem;
		background-color: var(--c-surface);
		box-shadow: 0 0 0 1px var(--c-black-light);
	}

	#header {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;

		#title {
			font-size: large;
			font-weight: bold;
			text-decoration: underline;
			text-decoration-color: var(--c-pink);
			text-decoration-thickness: 2px;
			text-underline-offset: 5px;
			animation: underline-animation 10s infinite
		}
	}

	.menu-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		animation: open 0.3s ease-in-out forwards;
		overflow: hidden;

		.selector {
			font-size: medium;
		}
	}

	@keyframes open {
		0% {
			transform: scaleY(0);
		}
		100% {
			transform: scaleY(1);
		}
	}

	.button-container {
		display: flex;
		width: 100%;
		justify-content: center;
	}

	.v-button {
		background-color: var(--c-black-light);
		border: 1px solid var(--c-black-light);
		padding: 12px 16px;
		cursor: pointer;
		border-radius: 6px;
		font-size: small;
	}

	#play:not(:disabled) {
		background-color: var(--c-pink);
		font-size: medium;
	}

	#reset {
		background-color: var(--c-pink);
	}

	#stopWaiting {
		width: auto;
		background-color: var(--c-pink);
	}

	.warning {
		color: rgb(238, 1, 1);
		font-size: small;
	}

	@keyframes underline-animation {
		0% {text-decoration-color: var(--c-pink);}
		50% {text-decoration-color: var(--c-teal);}
		100% {text-decoration-color: var(--c-pink);}
	}
</style>