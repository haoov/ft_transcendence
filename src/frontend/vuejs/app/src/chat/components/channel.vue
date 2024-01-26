<script setup lang="ts">
	import { onMounted, onUpdated, ref, type Ref } from 'vue';
	import v_message from './message.vue';
	import racketIcon from '@/assets/images/racket-50.png';
	import type { Channel } from '../classes';
	import { socketManager } from '@/SocketManager';

	let display: Ref<boolean> = ref(false);
	const props = defineProps<{channel: Channel}>();
	const input = ref<string>("");

	function sendMessage() {
		if (input.value === "" || input.value.length > 512)
			return;
		const DateRawStamp : string = new Date().toISOString();
		const newMessage = {
		senderId: socketManager.getUser().id,
		channelId: props.channel.getId(),
		text: input.value,
		datestamp: DateRawStamp
		};
		socketManager.sendMessage(newMessage);
		input.value = "";
	}

	function last(index: number) {
		if (index === props.channel.getMessages().length - 1)
			return "last";
		return "";
	}

	onUpdated(() => {
		const end = document.getElementById('last') as HTMLElement;
		end.scrollIntoView({ behavior: 'smooth' });
	});
</script>

<template>
	<div id="channel-container">
		<div
			id="channel"
			v-on:click="display = !display">
			<img id="icon" :src="racketIcon">
			<span>{{ channel.getName() }}</span>
		</div>
		<div
			id="messages-container"
			v-if="display">
			<TransitionGroup
				tag="div"
				id="messages"
				name="messages">
				<v_message
					v-for="(message, index) in channel.getMessages().reverse()"
					:id="last(index)"
					:key="message.getId()"
					:message="message"
					:index="index"
					:length="channel.getMessages().length">
				</v_message>
			</TransitionGroup>
		</div>
		<form
			v-if="display"
			id="message-form"
			v-on:submit.prevent="sendMessage()">
			<input
				id="message-input"
				name="new-message"
				type="text"
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
		border-radius: 0.5rem;
		flex-direction: column;
		background-color: var(--c-surface);
		box-shadow: 0 0 0 1px var(--c-black-light);
	}

	#channel {
		display: flex;
		border-radius: 0.5rem;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 30px;
		cursor: pointer;
	}

	#icon {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}

	#messages-container {
		display: flex;
		flex-direction: column;
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
		border-radius: 0.5rem;
		padding: 5px;
		background-color: var(--c-white);
		font-size: medium;
		color: var(--c-black);
	}
</style>