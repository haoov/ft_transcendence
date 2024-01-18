<script setup lang="ts">
	import { ref } from 'vue';
	import custumButton from './custumButton.vue';

	defineProps(["display", "text"]);
	const emit = defineEmits(["accept", "decline"]);

	let showNotification = ref(true);
	let accept = ref(false);

	function close() {
		if (accept.value)
			emit("accept");
		else
			emit("decline");
	}
</script>

<template>
	<Transition name="slide" v-on:after-leave="close()">
		<div v-if="display && showNotification" id="notification">
			<span id="text">{{ text }}</span>
			<custumButton v-on:click="accept = true; showNotification = false">Accept</custumButton>
			<custumButton v-on:click="showNotification = false">Decline</custumButton>
		</div>
	</Transition>
</template>

<style scoped>

	#notification {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--c-black-light);
		border-radius: 0.5rem;
		box-shadow: 0 0 0 10px var(--c-black-light);
		margin-top: 20px;
	}

	.slide-enter-from,
	.slide-leave-to {
		transform: translateX(-40px);
	}

	.slide-enter-active,
	.slide-leave-active {
		transition: transform 0.5s ease-in-out;
	}

	#text {
		padding: 10px;
	}
</style>