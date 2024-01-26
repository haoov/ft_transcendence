<script setup lang="ts">
	import { ref } from 'vue';
	import { Channel } from '../classes';
	import v_message from './message.vue';
	import chat from '@/chat/chat';
	import { socketManager } from '@/SocketManager';
	import cancelIcon from '@/assets/images/cancelIcon.png';

	const props = defineProps<{channel: Channel | undefined}>();
	const input = ref<string>("");

	function sendMessage() {
		if (props.channel)
			chat.sendMessage(input.value, props.channel, socketManager.getUser(), socketManager.sendMessage);
		input.value = "";
	}
</script>

<template>
	<div id="channel">
		<div 
			id="channel-bar">
			<span id="channelName">{{ channel?.getTitle(socketManager.getUser()) }}</span>
		</div>
		<TransitionGroup
			v-if="channel"
			appear
			tag="div"
			id="messages"
			name="messages">
			<v_message
				v-for="(message, index) in channel.getMessages()"
				:key="message.getId()"
				:message="message"
				:index="index"
				:length="(channel.getMessages().length)">
			</v_message>
		</TransitionGroup>
		<form
			v-on:submit.prevent="sendMessage()">
			<input
				id="message-input"
				name="new-message"
				autocomplete="off"
				placeholder="message"
				v-model="input">
		</form>
	</div>
</template>

<style scoped>
	#channel {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		width: 100%;
	}

	#channel-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 50px;
		background-color: var(--c-grey-light);
	}

	#message-input {
		height: auto;
		width: 100%;
		border: none;
		border-radius: 0.5rem;
		background-color: var(--c-grey-light);
		font-size: medium;
		color: var(--c-black);
		resize: none;
	}
</style>