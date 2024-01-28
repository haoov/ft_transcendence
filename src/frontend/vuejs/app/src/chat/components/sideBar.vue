<script setup lang="ts">
	import { chat } from '@/chat';
	import { TransitionGroup } from 'vue';
	import v_channelWidget from './channelWidget.vue';

	const emit = defineEmits(['setCurrentChannel']);
</script>

<template>
	<!--SIDE BAR-->
	<div id="side-bar">
		<!--CHANNEL WIDGETS-->
		<TransitionGroup
			appear
			tag="div"
			id="channelWidgets"
			name="channelWidgets">
			<v_channelWidget
				v-for="channel in chat.getUserChannels()"
				:key="channel.getId()"
				:channel="channel"
				v-on:click="emit('setCurrentChannel', channel)">
			</v_channelWidget>
		</TransitionGroup><!--CHANNEL WIDGETS END-->
		<div>
			<button id="addChannelButton"
				@click="chat.setChatMenu('channels')">
				+
			</button>
		</div>
	</div><!--SIDE BAR END-->
</template>

<style scoped>
	#side-bar {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		width: 300px;
		padding: 10px;
		box-sizing: border-box;
		gap: 10px;
		border-right: 1px solid var(--c-black-light);
	}

	#channelWidgets {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding: 10px;
		width: 100%;
		box-sizing: border-box;
		overflow: scroll;
	}

	#addChannelButton {
		width: 50px;
		height: 50px;
		border: none;
		border-radius: 50%;
		color: var(--c-black);
		transition: all 0.3s ease-in-out;
	}

	#addChannelButton:hover {
		transform: scale(1.1);
	}

	#addChannelButton:active {
		transform: scale(0.9);
	}

	.channelWidgets-move,
	.channelWidgets-enter-active,
	.channelWidgets-leave-active {
		transition: all 0.5s ease-in-out;
	}

	.channelWidgets-enter-from,
	.channelWidgets-leave-to {
		transform: scale(0);
	}

	.channelWidgets-enter-to,
	.channelWidgets-leave-from {
		transform: scale(1);
	}
</style>