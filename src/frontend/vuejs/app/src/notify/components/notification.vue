<script setup lang="ts">
	import type { Notification } from '../interfaces';
	import v_button from '../../components/custumButton.vue';

	const props = defineProps<{data: Notification}>();
</script>

<template>
	<div id="notification">
		<div id="notification-infos">
			<img v-if="data.icon" id="icon" :src="data.icon">
			<div id="notification-content">
				<span id="text">{{ data.message }}</span>
				<span class="sub-text" v-if="data.by">{{ data.by }}</span>
				<div id="buttons-container">
					<v_button
						v-for="button in data.buttons"
						class="v_button"
						v-on:click="button.action()">
						{{ button.text }}
					</v_button>
				</div>
			</div>
		</div>
		<div
			id="timeout-bar"
			v-if="data.autoClose && data.timeOutBar"
			:style="`animation: timeOutBar ${data.timeout}ms linear forwards`">
		</div>
	</div>
</template>

<style>
	#notification {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5px;
		background: var(--c-surface);
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		margin-top: 10px;
		width: 200px;
		min-height: 50px;
	}

	#notification-infos {
		display: grid;
		grid-template-columns: min-content;
		align-items: center;
		justify-content: center;
	}

	#icon {
		grid-row: 1;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		margin-right: 10px;
	}

	#notification-content {
		grid-row: 1;
		width: max-content;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#buttons-container {
		grid-row: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	#text {
		font-size: medium;
		padding: 5px;
	}

	.sub-text {
		font-size: small;
	}

	.v_button {
		width: 70px;
		margin: 5px;
		font-size: small;
	}

	#timeout-bar {
		width: 100%;
		height: 2px;
		background: var(--c-pink);
		align-self: flex-start;
	}

	@keyframes timeOutBar {
		0% { width: 100%; }
		80% { opacity: 1; }
		82% { opacity: 0; }
		84% { opacity: 1; }
		86% { opacity: 0; }
		88% { opacity: 1; }
		90% { opacity: 0; }
		92% { opacity: 1; }
		94% { opacity: 0; }
		96% { opacity: 1; }
		98% { opacity: 0; }
		100% { width: 0%; }
	}
</style>