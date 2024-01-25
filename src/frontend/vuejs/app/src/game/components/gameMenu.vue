<script setup lang="ts">
	import { ref, computed, inject, type Ref } from "vue";
	import loader from "@/components/loader.vue"
	import selector from "@/components/selector.vue"
	import CustumButton from "@/components/custumButton.vue";
	import { type SocketManager } from "@/SocketManager";
	import type { GameDifficulty, GameMap, GameMode, GameParams, GameType } from "@/game/interfaces";
	import gameData from "../gameData";

	const socketManager: SocketManager = inject("socketManager") as SocketManager;

	const selectedParams: Ref<GameParams> = ref({
		mode: undefined,
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
		selectedParams.value.mode = undefined;
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
	<div class="menu">
		<div v-if="display('selectMenu')" class="menu-box">
			<selector
				label="Mode"
				:values="modes"
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
			<CustumButton
				id="play"
				:disabled="!isEnabled"
				v-on:click="selectParams(selectedParams)">
				Play
			</CustumButton>
		</div>

		<!--Menu waiting for opponent-->
		<div v-if="display('waitingMenu')" class="menu-box">
			<loader :text="socketManager.getUser().status"></loader>
			<CustumButton id="stopWaiting" v-on:click="stopWaiting()">
				Stop waiting
			</CustumButton>
		</div>

		<!--Menu game finished-->
		<div v-if="display('finishedMenu')" class="menu-box">
			<span>{{ getWinner() }} won!</span>
			<CustumButton id="reset" v-on:click="newGame()">
				New game
			</CustumButton>
		</div>

		<!--Menu game ready-->
		<div v-if="display('readyMenu')" class="menu-box">
			<span>Game ready !</span>
			<loader :text="`Waiting for ${gameData.getOpponent()} response`"></loader>
			<span class="warning">If you chose to leave now, you will forfeit the game</span>
			<CustumButton id="stopWaiting" v-on:click="leaveGame()">
				Leave
			</CustumButton>
		</div>

		<!--Menu play-->
		<div v-if="display('playMenu')" class="menu-box">
			<span>Opponent found !</span>
			<div class="button-container">
				<CustumButton class="v-button" v-on:click="socketManager.play()">
					Play
				</CustumButton>
				<CustumButton class="v-button" v-on:click="socketManager.forfeit()">
					Forfeit
				</CustumButton>
			</div>
		</div>
	</div>

</template>

<style scoped>

	.menu {
		position: absolute;
		width: 720px;
		height: 480px;
		background: transparent;
		backdrop-filter: blur(3px);
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.menu-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 0.8rem;
		box-shadow: 0 0 10px 1px var(--c-black-light);
		padding: 15px;
		background-color: var(--c-surface);
		animation: open 0.3s ease-in-out forwards;
		overflow: hidden;
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
	}

	.v-button {
		margin: 10px 5px 0px 5px;
	}

	#play {
		margin-top: 50px;
		background-color: var(--c-grey);
	}

	#play:not(:disabled) {
		background-color: var(--c-pink);
		font-size: medium;
	}

	#reset {
		margin-top: 20px;
		background-color: var(--c-pink);
	}

	#stopWaiting {
		width: auto;
		margin-top: 20px;
		background-color: var(--c-pink);
	}

	.warning {
		color: rgb(238, 1, 1);
		font-size: small;
	}

</style>