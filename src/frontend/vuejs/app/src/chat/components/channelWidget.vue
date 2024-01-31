<script setup lang="ts">
	import { type Channel } from '@/chat';
	import { socketManager } from '@/SocketManager';

	const props = defineProps<{channel: Channel}>();
</script>

<template>
	<div id="channelWidget">
		<img
			id="channelWidgetIcon"
			:src="channel.getIcon(socketManager.getUser())">
		<div id="channelInfos">
			<span id="channelName">{{ channel.getTitle(socketManager.getUser()) }}</span>
			<span id="lastMessage">
				{{ channel.getMessages()[channel.getMessages().length - 1]?.getText() }}
			</span>
		</div>
	</div>
</template>

<style scoped>
	#channelWidget {
		display: flex;
		cursor: pointer;
		justify-content: flex-start;
	}

	#channelWidgetIcon {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 1px solid var(--c-black-light);
	}

	#channelInfos {
		display: flex;
    flex-direction: column;
    margin-top: 5px;
    width: 100%;
    margin-left: 10px;
    border-bottom: 1px solid var(--c-black-light);
	}

	#lastMessage {
		color: var(--c-grey);
		max-height: 20px;
		overflow: hidden;
	}
</style>