<script setup lang="ts">
	import type { Channel } from '../classes';
	import { socketManager } from '@/SocketManager';

	const props = defineProps<{channel: Channel}>();
</script>

<template>
	<div>
		<img
			id="channelWidgetIcon"
			:src="channel.getIcon(socketManager.getUser())">
	</div>
</template>

<style scoped>
 #channelWidgetIcon {
	width: 50px;
	height: 50px;
	border-radius: 50%;
 }
</style>