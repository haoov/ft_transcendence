<script setup lang="ts">
	import { ref, computed, inject, type Ref } from "vue";
	import loader from "@/components/loader.vue"
	import selector from "@/components/selector.vue"
	import { ClientEvents } from "@/utils";
	import type GameSocket from "../gameSocket";
	import custumButton from "@/components/custumButton.vue";
	import type { GameDifficulty, GameMap, GameMode, GameParams, GameType } from "@/game/interfaces";

	const props = defineProps(["winner"]);
	const emit = defineEmits(['click', 'stopWaiting']);
	const gameSocket: GameSocket = inject("gameSocket") as GameSocket;

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
				return (gameSocket.getuserStatus() == "");
			case "difficulty":
				return (selectedParams.value.type == "singleplayer");
			case "maps":
				return (selectedParams.value.mode == "super"
								&& selectedParams.value.type == "singleplayer");
			case "waitingMenu":
				return (gameSocket.getuserStatus() == "waiting");
			case "finishedMenu":
				return (gameSocket.getuserStatus() == "finished");
			case "readyMenu":
				return (gameSocket.getuserStatus() == "ready");
			default:
				return false;
		}
	}

	function newGame() {
		selectedParams.value.type = undefined
		selectedParams.value.map = "classic";
		selectedParams.value.difficulty = "easy";
		selectedParams.value.mode = undefined
		gameSocket.setuserStatus("");
	}

	function stopWaiting() {
		gameSocket.getSocket().emit(ClientEvents.stopWaiting);
		newGame();
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
			<custumButton
				id="play"
				:disabled="!isEnabled"
				v-on:click="emit('click', selectedParams)">
				Play
			</custumButton>
		</div>

		<!--Menu waiting for opponent-->
		<div v-if="display('waitingMenu')" class="menu-box">
			<loader :text="gameSocket.getuserStatus()"></loader>
			<custumButton id="stopWaiting" v-on:click="stopWaiting">
				Stop waiting
			</custumButton>
		</div>

		<!--Menu game finished-->
		<div v-if="display('finishedMenu')" class="menu-box">
			<span>{{ winner }} won!</span>
			<custumButton id="reset" v-on:click="newGame()">
				New game
			</custumButton>
		</div>

		<!--Menu game ready-->
		<div v-if="display('readyMenu')" class="menu-box">
			<span>Game Ready</span>
			<custumButton v-on:click="gameSocket.play()">
				Play
			</custumButton>
			<custumButton v-on:click="gameSocket.forfeit()">
				Forfeit
			</custumButton>
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