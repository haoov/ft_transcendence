<script setup lang="ts">
	import v_miniChannel from './miniChannel.vue';
	import { chat } from '@/chat';
</script>

<template>
	<TransitionGroup
		appear
		tag="div"
		id="channels"
		name="channels">
		<v_miniChannel
			v-for="channel in chat.getActiveChannels()"
			:key="channel.getId()"
			:channel="channel">
		</v_miniChannel>
	</TransitionGroup>
</template>

<style scoped>
	#channels {
		position: absolute;
		bottom: 5px;
		right: 15px;
		display: flex;
		align-items: flex-end;
		flex-direction: row;
		gap: 10px;
	}

	.channels-move,
	.channels-enter-active,
	.channels-leave-active {
		transition: all 0.5s ease-in-out;
	}

	.channels-leave-active {
		position: absolute;
	}

	.channels-enter-from,
	.channels-leave-to {
		transform: translateY(30px);
	}

	.channels-enter-to,
	.channels-leave-from {
		transform: translateY(0);
	}
</style>@/chat/classes/chat