<script setup lang="ts">

	import { ref, computed } from "vue";
	import loader from "@/components/loader.vue"
	import selector from "@/components/selector.vue"

	defineProps(["state"]);

	const games: string[] = ["classic", "super"];
	const difficulties: string[] = ["easy", "medium", "hard"];
	const modes: string[] = ["singlePlayer", "multiPlayer"];
	const maps: string[] = ["tennis", "space"];

	const selectedGame = ref("");
	const selectedMode = ref("");
	const selectedDifficulty = ref("");
	const selectedMap = ref("random");

	const isDisabled = computed(() => {
		return 	!selectedGame.value || !selectedMode.value
						|| (selectedMode.value == "singlePlayer" && (!selectedDifficulty.value || !selectedMap.value));
	});

	const emit = defineEmits(['click']);

	let playClick = ref(false);

	function play() {
		playClick.value = true;
		emit("click", {
			game: selectedGame.value,
			mode: selectedMode.value,
			difficulty: selectedDifficulty.value,
			map: selectedMap.value});
	}

</script>

<template>

	<div class="menu">
		<div v-if="playClick == false" class="menu-box">
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
			<button id="playButton" type="submit" :disabled="isDisabled" v-on:click="play">Play</button>
		</div>
		<div v-else class="menu-box">
			<loader :text="state"></loader>
		</div>
	</div>

</template>

<style scoped>

	.menu {
		position: absolute;
		width: 720px;
		height: 480px;
		background: var(--c-black);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.menu-box {
		text-align: center;
		border: 1px solid var(--c-white);
		border-radius: 0.5rem;
		padding: 10px;
		background-color: var(--c-black-light);
	}

	#playButton {
		width: 100px;
		margin-top: 50px;
		border-radius: 0.5rem;
		border: none;
		padding: .5rem;
		background-color: var(--c-grey);
		cursor: pointer;
	}

	#playButton:not(:disabled) {
		background-color: var(--c-pink);
		font-size: medium;
	}

</style>