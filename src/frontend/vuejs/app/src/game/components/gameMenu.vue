<script setup lang="ts">

	import { ref, computed, inject } from "vue";
	import loader from "@/components/loader.vue"
	import selector from "@/components/selector.vue"
	import GlobalSocket from "@/GlobalSocket";
	import { ClientEvents, ServerEvents } from "@/utils";

	const props = defineProps(["state", "winner"]);
	const emit = defineEmits(['click', 'stopWaiting']);

	const globalSocket: GlobalSocket = inject("globalSocket") as GlobalSocket;
	const games: string[] = ["classic", "super"];
	const difficulties: string[] = ["easy", "medium", "hard"];
	const modes: string[] = ["singlePlayer", "multiPlayer"];
	const maps: string[] = ["classic", "tennis", "space", "random"];
	const selectedGame = ref("");
	const selectedMode = ref("");
	const selectedDifficulty = ref("");
	const selectedMap = ref("classic");

	const isDisabled = computed(() => {
		return 	!selectedGame.value || !selectedMode.value
						|| (selectedMode.value == "singlePlayer" && (!selectedDifficulty.value || !selectedMap.value));
	});

	function play() {
		emit("click", {
			game: selectedGame.value,
			mode: selectedMode.value,
			difficulty: selectedDifficulty.value,
			map: selectedMap.value});
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

	<div class="menu">
		<div v-if="!state" class="menu-box">
			<selector
				:label="'Game'"
				:values="games"
				@select="(value) => {selectedGame = value}"
			></selector>
			<selector
				:label="'Mode'"
				:values="modes"
				@select="(value) => {selectedMode = value}"
			></selector>
			<selector
				v-if="selectedMode == 'singlePlayer'"
				:label="'Difficulty'"
				:values="difficulties"
				@select="(value) => {selectedDifficulty = value}"
			></selector>
			<selector
				v-if="selectedMode == 'singlePlayer' && selectedGame == 'super'"
				:label="'Map'"
				:values="maps"
				@select="(value) => {selectedMap = value}"
			></selector>
			<button
				class="custumButton"
				id="play" type="submit"
				:disabled="isDisabled"
				v-on:click="play"
				>Play</button>
		</div>
		<div v-else-if="state != 'finished' && !globalSocket.getDisplayValue(ServerEvents.gameReady)" class="menu-box">
			<loader :text="state"></loader>
			<button v-if="state == 'waiting'" class="custumButton" id="stopWaiting" v-on:click="stopWaiting">Stop waiting</button>
		</div>
		<div v-else-if="!globalSocket.getDisplayValue(ServerEvents.gameReady)" class="menu-box">
			<span>{{ winner }} won!</span>
			<button class="custumButton" id="reset" v-on:click="reloadMenu()">New game</button>
		</div>
		<div v-if="globalSocket.getDisplayValue(ServerEvents.gameReady)" class="menu-box">
			<span>Game Ready</span>
			<button class="custumButton" v-on:click="globalSocket.getSocket().emit(ClientEvents.gamePlay)">Play</button>
			<button class="custumButton" v-on:click="globalSocket.getSocket().emit(ClientEvents.gameForfeit)">Forfeit</button>
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
		border-radius: 1rem;
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
		border: 1px solid var(--c-white);
		border-radius: 0.5rem;
		padding: 15px;
		background-color: var(--c-black-light);
	}

	.custumButton {
		width: 100px;
		border-radius: 0.5rem;
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