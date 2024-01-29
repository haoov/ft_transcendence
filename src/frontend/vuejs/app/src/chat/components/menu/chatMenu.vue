<script setup lang="ts">
	import { Channel, chat } from '@/chat'
	import v_channelsMenu from './channelsMenu.vue'
	import v_settingsMenu from './settingsMenu.vue'

	const props = defineProps<{channel: Channel | undefined}>();
</script>

<template>
	<Transition
		tag="div"
		id="displayMenu"
		name="displayMenu">
		<div
			v-if="chat.getChatMenu().value != 'none'"
			v-on:click="chat.setChatMenu('none')">
			<v_channelsMenu
				v-if="chat.getChatMenu().value == 'channels'"
				v-on:click.stop>
			</v_channelsMenu>
			<v_settingsMenu
				v-if="chat.getChatMenu().value == 'settings'"
				v-on:click.stop
				:channel="channel">
			</v_settingsMenu>
		</div>
	</Transition>
</template>

<style scoped>
	#displayMenu {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: transparent;
		backdrop-filter: blur(5px);
	}

	.displayMenu-enter-active,
	.displayMenu-leave-active {
		transition: all 0.3s ease-in-out;
	}

	.displayMenu-enter-from,
	.displayMenu-leave-to {
		opacity: 0;
		transform: scale(0);
	}

	.displayMenu-enter-to,
	.displayMenu-leave-from {
		opacity: 1;
		transform: scale(1);
	}
</style>
