<script setup lang="ts">
	import notify from '../notify';
	import type { Notification } from '../interfaces';
	import v_button from '../../components/custumButton.vue';

	const props = defineProps<{data: Notification}>();
</script>

<template>
	<div id="notification">
		<span id="text">{{ data.message }}</span>
		<span class="sub-text" v-if="data.by">{{ data.by }}</span>
		<div id="buttons-container">
			<v_button class="v_button" v-on:click="notify.removeNotification(data.id)">Accept</v_button>
			<v_button class="v_button" v-on:click="notify.removeNotification(data.id)">Decline</v_button>
		</div>
		<div
			id="timeout-bar"
			v-if="data.autoClose"
			:style="`animation: timeOutBar ${data.timeout}ms linear forwards`"></div>
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