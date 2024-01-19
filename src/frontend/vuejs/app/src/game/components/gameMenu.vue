<script setup lang="ts">

	import { ref, computed, inject } from "vue";
	import loader from "@/components/loader.vue"
	import selector from "@/components/selector.vue"
	import GlobalSocket from "@/GlobalSocket";
	import { ClientEvents, ServerEvents } from "@/utils";
	import GameSocket from "../gameSocket";
	import custumButton from "@/components/custumButton.vue";

	const props = defineProps(["winner"]);
	const emit = defineEmits(['click', 'stopWaiting']);

	const selectedParams = ref({
		game: "",
		mode: "",
		difficulty: "",
		map: "classic"
	});

	const gameSocket: GameSocket = inject("gameSocket") as GameSocket;
	const games: string[] = ["classic", "super"];
	const difficulties: string[] = ["easy", "medium", "hard"];
	const modes: string[] = ["singlePlayer", "multiPlayer"];
	const maps: string[] = ["classic", "tennis", "space", "random"];

	const isEnabled = computed(() => {
		return (selectedParams.value.game && selectedParams.value.mode);
	});

	function selectParams() {
		emit("click", {
			game: selectedParams.value.game,
			mode: selectedParams.value.mode,
			difficulty: selectedParams.value.difficulty,
			map: selectedParams.value.map});
	}

	function reloadMenu() {
		window.location.reload();
	}

	function stopWaiting() {
		emit(ClientEvents.stopWaiting);
		selectedGame.value = "";
		selectedMap.value = "classic";
		selectedMode.value = "";
		selectedDifficulty.value = "";
	}

</script>

<template>
	<!--Menu select params-->
	<div class="menu">
		<div v-if="!gameSocket.getUserState()" class="menu-box">
			<selector
				:label="'Game'"
				:values="games"
				@select="(value) => {selectedParams.game = value}"
			></selector>
			<selector
				:label="'Mode'"
				:values="modes"
				@select="(value) => {selectedParams.mode = value}"
			></selector>
			<selector
				v-if="selectedParams.mode == 'singlePlayer'"
				:label="'Difficulty'"
				:values="difficulties"
				@select="(value) => {selectedParams.difficulty = value}"
			></selector>
			<selector
				v-if="selectedParams.mode == 'singlePlayer' && selectedParams.game == 'super'"
				:label="'Map'"
				:values="maps"
				@select="(value) => {selectedParams.map = value}"
			></selector>
			<custumButton id="play" :disabled="!isEnabled" v-on:click="selectParams()">Play</custumButton>
		</div>

		<!--Menu waiting for opponent-->
		<div
			v-else-if="gameSocket.getUserState() != 'finished'"
			class="menu-box"
			>
			<loader :text="gameSocket.getUserState()"></loader>
			<custumButton
				v-if="gameSocket.getUserState() == 'waiting'"
				id="stopWaiting"
				v-on:click="stopWaiting"
				>Stop waiting</custumButton>
		</div>

		<!--Menu game finished-->
		<div class="menu-box">
			<span>{{ winner }} won!</span>
			<custumButton id="reset" v-on:click="reloadMenu()">New game</custumButton>
		</div>

		<!--Menu game ready-->
		<div class="menu-box">
			<span>Game Ready</span>
			<custumButton v-on:click="gameSocket.getSocket().emit(ClientEvents.gamePlay)">Play</custumButton>
			<custumButton v-on:click="gameSocket.getSocket().emit(ClientEvents.gameForfeit)">Forfeit</custumButton>
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
		box-shadow: 0 0 0 1px var(--c-black-light);
		padding: 15px;
		background-color: var(--c-surface);
	}

	.custumButton {
		width: 100px;
		border-radius: 0.8rem;
		border: none;
		padding: .5rem;
		cursor: pointer;
		font-size: medium;
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

</style>