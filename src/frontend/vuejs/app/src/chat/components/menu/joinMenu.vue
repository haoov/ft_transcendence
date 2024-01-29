<script setup lang="ts">
	import { socketManager } from '@/SocketManager';
	import { chat, type Channel, type ChannelData } from '@/chat';
	import { computed, ref, type Ref } from 'vue';

	const joignableChannels: ChannelData[] = await chat.getJoinableChannels(socketManager.getUser());

	const search: Ref<string> = ref('');

	const searchResults = computed((): ChannelData[] => {
		if (search.value.length == 0)
			return [];
		else {
			return joignableChannels.filter((channel: ChannelData) => {
				console.log(channel);
				return channel.name.toLowerCase().startsWith(search.value.toLowerCase());
			});
		}
	});
</script>

<template>
	<div id="joinMenu">
		<div>
			<label id="inputLabel">
				Search channel :
				<div class="inputContainer">
					<img id="searchIcon">
					<input id="searchChannel"
						type="text"
						autocomplete="off"
						placeholder="Search..."
						v-model="search">
				</div>
			</label>
			<div id="searchResults">
				<div
					class="searchResult"
					v-for="channel in searchResults"
					v-on:click="search = channel.name">
					{{ channel.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	#joinMenu {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 30px;

		#inputLabel {
			display: flex;
			flex-direction: column;
			gap: 5px;
			font-size: 1.4rem;
			color: var(--c-grey-light);

			#searchChannel {
				width: 80%;
				padding: 3% 7%;
				border-radius: 8px;
				color: var(--c-white);
				background-color: transparent;
				border: 1px solid var(--c-grey);
			}
		}

		#searchResults {
			position: absolute;
			display: flex;
			flex-direction: column;
			background-color: var(--c-grey);

			.searchResult {
				display: flex;
				align-items: center;
				padding: 5px;
				font-size: small;
				color: var(--c-black-light);
				width: 100px;
				cursor: pointer;
			}
		}
	}
</style>