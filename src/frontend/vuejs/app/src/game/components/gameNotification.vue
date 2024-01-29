<script setup lang="ts">
	import { ref } from 'vue';

	defineProps(["display", "text"]);

	let showNotification = ref(false);
	let accept = ref(false);

</script>

<template>
	<Transition name="blurred" v-on:enter="showNotification = true">
		<div v-if="display" id="background">
			<Transition name="slide" v-on:after-leave="$emit('close')">
				<div v-if="showNotification" id="notification" v-on:click.stop>
					<span id="text">{{ text }}</span>
					<button v-on:click="accept = true; showNotification = false">Got to game</button>
				</div>
			</Transition>
		</div>
	</Transition>
</template>

<style scoped>
	#background {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		backdrop-filter: blur(5px);
	}

	.blurred-enter-from,
	.blurred-leave-to {
		filter: blur(0px);
	}

	.blurred-enter-active,
	.blurred-leave-active {
		transition: filter 0.2s ease-in-out;
	}

	#notification {
		position: absolute;
		background-color: var(--c-black-light);
		border-radius: 0.8rem;
		box-shadow: 0 0 0 10px var(--c-black-light);
		margin-top: 20px;
	}

	.slide-enter-from,
	.slide-leave-to {
		transform: translateY(-40px);
	}

	.slide-enter-active,
	.slide-leave-active {
		transition: transform 0.5s ease-in-out;
	}

	#text {
		padding: 10px;
	}
</style>