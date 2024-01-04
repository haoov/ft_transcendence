<script setup lang="ts">

	import { ref, computed} from "vue";

	const games: string[] = ["classic", "super"];
	const difficulties: string[] = ["easy", "medium", "hard"];
	const modes: string[] = ["singlePlayer", "multiPlayer"];

	

	const selectedGame = ref("");
	const selectedMode = ref("");
	const selectedDifficulty = ref("");

	const isDisabled = computed(() => {
		return !selectedGame.value || !selectedMode.value || (selectedMode.value == "singlePlayer" && !selectedDifficulty.value);
	});

	const emit = defineEmits(['click']);

	function play() {
		emit("click", {
			game: selectedGame.value,
			mode: selectedMode.value,
			difficulty: selectedDifficulty.value});
	}

</script>

<template>

	<div class="menu">
		<div class="selection">
			<label for="Game">Game</label>
			<div class="radio-inputs" id="Game">
				<label class="radio" v-for="game in games">
					<input type="radio" v-model="selectedGame" :value="game" name="game">
					<span class="name">{{ game }}</span>
				</label>
			</div>
		</div>
		<div class="selection">
			<label for="mode">Mode</label>
			<div class="radio-inputs" id="mode">
				<label class="radio" v-for="mode in modes">
					<input type="radio" v-model="selectedMode" :value="mode" name="mode">
					<span class="name">{{ mode }}</span>
				</label>
			</div>
		</div>
		<div class="selection" v-if="selectedMode == 'singlePlayer'">
			<label for="difficulty">Difficulty</label>
			<div class="radio-inputs" id="difficulty">
				<label class="radio" v-for="difficulty in difficulties">
					<input type="radio" v-model="selectedDifficulty" :value="difficulty" name="difficulty">
					<span class="name">{{ difficulty }}</span>
				</label>
			</div>
		</div>
		<button id="playButton" type="submit" :disabled="isDisabled" v-on:click="play">Play</button>
	</div>

</template>

<style scoped>

	.menu {
		position: absolute;
		width: 720px;
		height: 480px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.selection {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.radio-inputs {
		display: flex;
		flex-wrap: wrap;
		border-radius: 0.5rem;
		background-color: linear-gradient(var(--c-black), var(--c-black)) padding-box;
		box-sizing: border-box;
		box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
		padding: 0.25rem;
		width: 100%;
		font-size: 14px;
		justify-content: center;
}

	.radio-inputs .radio {
		display: flex;
		margin: 5px;
		text-align: center;
	}

	.radio-inputs .radio input {
		display: none;
	}

	.radio-inputs .radio .name {
		width: 100px;
		cursor: pointer;
		border-radius: 0.5rem;
		border: none;
		padding: .5rem 0.5rem;
		background-color: var(--c-grey);
		transition: all .15s ease-in-out;
	}

	.radio-inputs .radio input:checked + .name {
		background-color: var(--c-pink);
		font-weight: 600;
	}

	#playButton {
		width: 100px;
		border-radius: 0.5rem;
		border: none;
		padding: .5rem;
		background-color: var(--c-grey);
		cursor: pointer;
	}

	#playButton:not(:disabled) {
		background-color: var(--c-pink);
		font-weight: 600;
	}

</style>