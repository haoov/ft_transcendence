<script setup lang="ts">
	import { ref, type Ref } from 'vue';
	import { Channel } from '../classes';
	import v_message from './message.vue';
	import v_topBar from './topBar.vue';
	import { chat, type MessageParams } from '@/chat';
	import { socketManager } from '@/SocketManager';

	const props = defineProps<{channel: Channel | undefined}>();
	const input: Ref<string> = ref<string>("");

	function sendMessage() {
		if (input.value == "" || input.value.length > 512)
			return;
		const messageParams: MessageParams = {
			sender: socketManager.getUser(),
			channelId: props.channel?.getId() || 0,
			text: input.value,
			datestamp: new Date().toISOString()
		};
		socketManager.emit("chat", "newMessage", messageParams);
		input.value = "";
	}
</script>

<template>
	<div id="channel">
		<v_topBar :channel="channel"></v_topBar>
		<div id="messages-container">
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
		</div>
		<form id="message-form"
			v-on:submit.prevent="sendMessage()">
			<input
				id="message-input"
				name="new-message"
				autocomplete="off"
				placeholder="message"
				:disabled="!channel"
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

	#messages-container {
		display: flex;
		flex-direction: column-reverse;
		height: 100%;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		overflow: scroll;
		background-color: var(--c-black-light);
	}

	#message-form {
		display: flex;
	}

	#message-input {
		height: auto;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		border: none;
		border-radius: 0.8rem;
		background-color: var(--c-white);
		font-size: medium;
		color: var(--c-black);
	}

	.messages-move,
	.messages-enter-active,
	.messages-leave-active {
		transition: all 0.5s ease-in-out;
	}

	.messages-enter-from,
	.messages-leave-to {
		opacity: 0;
		transform: scale(0);
	}

	.messages-enter-to,
	.messages-leave-from {
		opacity: 1;
		transform: scale(1);
	}
</style>