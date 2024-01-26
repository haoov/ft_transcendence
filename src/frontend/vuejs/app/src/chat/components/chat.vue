<script setup lang="ts">
	import chat from '@/chat/chat' 
	import v_channelWidget from './channelWidget.vue';
	import v_channel from './channel.vue';
</script>

<template>
	<div id="chat">
		<div id="side-bar">
			<TransitionGroup
				appear
				tag="div"
				id="channelWidgets"
				name="channelWidgets">
				<v_channelWidget
					v-for="channel in chat.getUserChannels()"
					:key="channel.getId()"
					:channel="channel">
				</v_channelWidget>
			</TransitionGroup>
		</div>
		<v_channel :channel="chat.getCurrentChannel()"></v_channel>
	</div>
</template>

<style scoped>
	#chat {
		display: flex;
		align-items: flex-start;
		height: 90%;
		width: 90%;
		margin-top: 20px;
		margin-bottom: 5px;
		border-radius: 0.5rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		background-color: var(--c-surface);
	}

	#side-bar {
		display: flex;
		height: 100%;
		background-color: var(--c-black-light);
	}

	#channelWidgets {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 20px 10px 10px 10px;
	}
</style>