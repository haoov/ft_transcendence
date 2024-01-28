<script setup lang="ts">
	import { chat, type Channel, type ChannelParams } from '@/chat';
	import cancelIcon from '@/assets/images/cancelIcon.png';
	import { socketManager } from '@/SocketManager';

	const props = defineProps<{channel: Channel | undefined}>();

	const updatedParams: ChannelParams = {
		name: '',
		mode: 'Public',
		creatorId: 0,
		users: [],
	};

	function updateChannel() {
		if (props.channel) {
			chat.updateChannel(props.channel, updatedParams);
		}
		chat.setChatMenu('none');
	}
</script>

<template>
	<div id="settingsMenu">
		<div id="header">
			<div></div>
			<div id="title">Edit</div>
			<div id="closeButton" v-on:click="chat.setChatMenu('none')">
				<img id="closeIcon"
					:src="cancelIcon">
			</div>
		</div>
		<div id="body">
			<label class="inputLabel">
				Channel Name :
				<input id="channelName"
					class="channelInput"
					type="text"
					autocomplete="off"
					:placeholder="channel?.getTitle(socketManager.getUser())"
					v-model="updatedParams.name">
			</label>
			<label class="inputLabel">
				Add Users :
				<div class="inputContainer">
					<img id="searchIcon">
					<input id="addUsers"
						class="channelInput"
						type="text"
						autocomplete="off"
						placeholder="Search...">
				</div>
			</label>
		</div>
		<div id="footer">
			<div id="saveButton"
				v-on:click="updateChannel()">
				Save
			</div>
		</div>
	</div>
</template>

<style scoped>
	#settingsMenu {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 300px;
		gap: 30px;
		padding: 30px;
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		background-color: var(--c-surface);
	}

	#header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		#title {
			font-size: large;
			font-weight: bold;
			text-decoration: underline;
			text-decoration-color: var(--c-pink);
			text-decoration-thickness: 2px;
			text-underline-offset: 5px;
			animation: underline-animation 10s infinite
		}

		#closeIcon {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			transition: all 0.3s ease-in-out;
			&:hover {
				background-color: var(--c-black-light);
				box-shadow: 0 0 0 0.4rem var(--c-black-light);
			}
			&:active {
				transform: scale(0.9);
			}
		}
	}

	#body {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 30px;

		.inputLabel {
			display: flex;
			flex-direction: column;
			gap: 5px;
			font-size: small;
			color: var(--c-grey);
		}

		.channelInput {
			width: 80%;
			padding: 3% 7%;
			border-radius: 8px;
			color: var(--c-white);
			background-color: transparent;
			border: 1px solid var(--c-grey);
		}
	}

	#footer {
		#saveButton {
			background-color: var(--c-black-light);
			border: 1px solid var(--c-black-light);
			padding: 12px 16px;
			cursor: pointer;
			border-radius: 6px;
			font-size: small;
		}
	}

	@keyframes underline-animation {
		0% {text-decoration-color: var(--c-pink);}
		50% {text-decoration-color: var(--c-teal);}
		100% {text-decoration-color: var(--c-pink);}
	}
</style>