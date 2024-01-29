<script setup lang="ts">
	import { chat } from '@/chat';
	import { TransitionGroup, type Ref, ref, watch } from 'vue';
	import v_channelWidget from './channelWidget.vue';
	import { socketManager } from '@/SocketManager';

	const emit = defineEmits(['setCurrentChannel']);
	const searchResults: Ref<any> = ref(chat.getUserChannels());
	const search: Ref<string> = ref('');

	watch(search, (value) => {
		if (value.length > 0) {
			searchResults.value = chat.getUserChannels().filter((channel) => {
				return channel.getTitle(socketManager.getUser()).toLowerCase().startsWith(value.toLowerCase());
			});
		}
		else {
			searchResults.value = chat.getUserChannels();
		}
	})
</script>

<template>
	<!--SIDE BAR-->
	<div id="side-bar">
		<div id="searchChannel">
			<div id="searchContainer">
				<input id="searchInput"
					type="text"
					autocomplete="off"
					placeholder="Search..."
					v-model="search">
			</div>
			<!--CHANNEL WIDGETS-->
			<TransitionGroup
				appear
				tag="div"
				id="channelWidgets"
				name="channelWidgets">
				<v_channelWidget
					v-for="channel in searchResults"
					:key="channel.getId()"
					:channel="channel"
					v-on:click="emit('setCurrentChannel', channel)">
				</v_channelWidget>
			</TransitionGroup><!--CHANNEL WIDGETS END-->
		</div>
		<div id="buttonContainer">
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
		align-items: flex-start;
		height: 100%;
		width: 300px;
		padding: 10px;
		box-sizing: border-box;
		gap: 10px;
		border-right: 1px solid var(--c-black-light);

		#searchChannel {
			#searchInput {
				width: 100%;
				height: 30px;
				border: none;
				border-radius: 5px;
				padding: 5px 20px;
				margin-bottom: 10px;
				box-sizing: border-box;
				background-color: var(--c-black-light);
			}

			#channelWidgets {
				display: flex;
				flex-direction: column;
				gap: 15px;
				padding: 10px 0px;
				width: 100%;
				max-height: 700px;
				box-sizing: border-box;
				overflow: scroll;
			}
		}
	}

	#buttonContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	#addChannelButton {
		width: 50px;
		height: 50px;
		border: none;
		border-radius: 50%;
		color: var(--c-black);
		font-size: medium;
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
		transition: all 0.3s ease-in-out;
	}

	.channelWidgets-leave-active {
		position: absolute;
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