<script setup lang="ts">
	import { ref, computed, inject, type Ref } from "vue";
	import loader from "@/components/loader.vue"
	import selector from "@/components/selector.vue"
	import CustumButton from "@/components/custumButton.vue";
	import type SocketManager from "@/SocketManager";
	import type { GameDifficulty, GameMap, GameMode, GameParams, GameType } from "@/game/interfaces";

	const props = defineProps<{state: string, winner: string}>();
	const emit = defineEmits(['click', 'stopWaiting', 'newGame']);
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
				return (props.state == "noGame");
			case "difficulty":
				return (selectedParams.value.type == "singleplayer");
			case "maps":
				return (selectedParams.value.mode == "super"
								&& selectedParams.value.type == "singleplayer");
			case "waitingMenu":
				return (props.state == "waiting");
			case "finishedMenu":
				return (props.state == "finished");
			case "readyMenu":
				return (props.state == "ready");
			default:
				return false;
		}
	}

	function newGame() {
		selectedParams.value.type = undefined
		selectedParams.value.map = "classic";
		selectedParams.value.difficulty = "easy";
		selectedParams.value.mode = undefined;
		emit("newGame");
	}

	function stopWaiting() {
		socketManager.stopWaiting();
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
			<CustumButton
				id="play"
				:disabled="!isEnabled"
				v-on:click="emit('click', selectedParams)">
				Play
			</CustumButton>
		</div>

		<!--Menu waiting for opponent-->
		<div v-if="display('waitingMenu')" class="menu-box">
			<loader :text="socketManager.getUser().status"></loader>
			<CustumButton id="stopWaiting" v-on:click="stopWaiting">
				Stop waiting
			</CustumButton>
		</div>

		<!--Menu game finished-->
		<div v-if="display('finishedMenu')" class="menu-box">
			<span>{{ winner }} won!</span>
			<CustumButton id="reset" v-on:click="newGame()">
				New game
			</CustumButton>
		</div>

		<!--Menu game ready-->
		<div v-if="display('readyMenu')" class="menu-box">
			<span>Game Ready</span>
			<CustumButton v-on:click="socketManager.play()">
				Play
			</CustumButton>
			<CustumButton v-on:click="socketManager.forfeit()">
				Forfeit
			</CustumButton>
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