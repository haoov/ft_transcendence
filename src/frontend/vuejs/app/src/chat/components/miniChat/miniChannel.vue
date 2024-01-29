<script setup lang="ts">
	import { onUpdated, ref, type Ref } from 'vue';
	import v_miniMessage from './miniMessage.vue';
	import cancelIcon from '@/assets/images/cancelIcon.png';
	import { type Channel, type MessageParams } from '@/chat';
	import { socketManager } from '@/SocketManager';
	import { chat } from '@/chat';

	let display: Ref<boolean> = ref(false);
	const props = defineProps<{channel: Channel}>();
	const input = ref<string>("");

	function sendMessage() {
		if (input.value == "" || input.value.length > 512)
			return;
		const messageParams: MessageParams = {
			sender: socketManager.getUser(),
			channelId: props.channel.getId(),
			text: input.value,
			datestamp: new Date().toISOString()
		};
		socketManager.emit("chat", "newMessage", messageParams);
		input.value = "";
	}

	function last(index: number) {
		if (index === props.channel.getMessages().length - 1)
			return "last";
		return "";
	}

	onUpdated(() => {
		const end = document.getElementById('last') as HTMLElement;
		end?.scrollIntoView({ behavior: 'smooth' });
	});
</script>

<template>
	<div id="channel-container">
		<div
			id="channel"
			v-on:click="display = !display">
			<img id="icon" :src="channel.getIcon(socketManager.getUser())">
			<span id="channelName">{{ channel.getTitle(socketManager.getUser()) }}</span>
			<img
				id="cancelIcon"
				:src="cancelIcon"
				title="close"
				v-on:click="chat.removeActiveChannel(channel.getId())">
		</div>
		<div
			id="messages-container"
			v-if="display">
			<TransitionGroup
				appear
				tag="div"
				id="messages"
				name="messages">
				<v_miniMessage
					v-for="(message, index) in channel.getMessages()"
					:id="last(index)"
					:key="message.getId()"
					:message="message"
					:index="index"
					:length="channel.getMessages().length">
				</v_miniMessage>
			</TransitionGroup>
		</div>
		<form
			v-if="display"
			id="message-form"
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
	#channel-container {
		display: flex;
		flex-direction: column;
		width: 230px;
		border-radius: 0.8rem;
		flex-direction: column;
		background-color: var(--c-surface);
		box-shadow: 0 0 0 1px var(--c-black-light);
	}

	#channel {
		display: flex;
		border-radius: 0.8rem;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 30px;
		cursor: pointer;
		border: 0.5px solid var(--c-black-light);
	}

	#channelName {
		overflow: hidden;
		margin: 5px;
	}

	#icon {
		width: 25px;
		height: 25px;
		margin-left: 10px;
		border-radius: 50%;
	}

	#cancelIcon {
		width: 15px;
		height: 15px;
		cursor: pointer;
		margin-right: 10px;
		margin-left: 0px;
		border-radius: 50%;
	}

	#cancelIcon:hover {
		background-color: var(--c-black-light);
		box-shadow: 0 0 0 0.4rem var(--c-black-light);
	}

	#messages-container {
		display: flex;
		flex-direction: column-reverse;
		max-height: 300px;
		padding: 5px;
		gap: 5px;
		background-color: var(--c-black-light);
		overflow-y: scroll;
		overflow-x: hidden;
	}

	#messages-container::-webkit-scrollbar {
		width: 5px;
	}

	#messages-container::-webkit-scrollbar-thumb {
		background: var(--c-grey);
		border-radius: 8px;
	}

	#messages-container::-webkit-scrollbar-track {
		background: transparent;
	}

	#message-form {
		display: flex;
		justify-content: center;
	}

	#message-input {
		height: auto;
		width: 100%;
		border: none;
		border-radius: 0.8rem;
		padding: 5px;
		background-color: var(--c-white);
		font-size: medium;
		color: var(--c-black);
		resize: none;
	}

	.messages-move,
	.messages-enter-active {
		transition: all 0.5s ease-in-out;
	}

	.messages-enter-from {
		transform: scale(0);
	}

	.messages-enter-to {
		transform: scale(1);
	}
</style>@/chat/classes/chat