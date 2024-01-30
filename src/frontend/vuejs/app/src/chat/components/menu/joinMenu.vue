<script setup lang="ts">
	import { socketManager } from '@/SocketManager';
	import { chat, type Channel, type ChannelData } from '@/chat';
	import { computed, ref, type Ref } from 'vue';

	const emit = defineEmits({
		selectChannel: (channel: ChannelData) => channel
	});

	const joignableChannels: ChannelData[] = await chat.getJoinableChannels(socketManager.getUser());

	const search: Ref<string> = ref('');
	const result: Ref<ChannelData> = ref({} as ChannelData);
	const searchResults = computed((): ChannelData[] => {
		if (search.value.length == 0) { 
			return [];
		}
		else {
			return joignableChannels.filter((channel: ChannelData) => {
				return channel.name.toLowerCase().startsWith(search.value.toLowerCase());
			});
		}
	});

	function selectChannel(channel: ChannelData) {
		emit('selectChannel', channel);
		search.value = channel.name;
	}


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
					v-on:click="selectChannel(channel)"
					>
						{{ channel.name }}
						<span v-if="channel.mode === 'Protected'">
							<svg fill="#7c7979" height="10px" width="10px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#7c7979">
							<g id="SVGRepo_bgCarrier" stroke-width="0"/>
							<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
							<g id="SVGRepo_iconCarrier"> <g id="XMLID_509_"> <path id="XMLID_510_" d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85 S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15 s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25 C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"/> </g> </g>
							</svg>
						</span>
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
			display: flex;
			flex-direction: column;
			width: 94%;
			max-height: 160px;
			overflow-y: auto;
			align-items: center;

			.searchResult {
				width: 90%;
				background-color: var(--c-grey);
				border-radius: 7px;
				margin-top: 5px;
				display: flex;
				align-items: center;
				padding: 5px;
				font-size: small;
				color: var(--c-black-light);
				cursor: pointer;
				transition: all 0.3s ease-in-out;

				&:hover {
					background-color: var(--c-black-light);
					color: var(--c-grey);
					border: var(--c-grey-light) 1px solid;
					animation: border-animation 5s infinite;
				}

				@keyframes border-animation {
					0% {
						border: var(--c-pink) 1px solid;
					}
					50% {
						border: var(--c-teal) 1px solid;
					}
					100% {
						border: var(--c-pink) 1px solid;
					}
				}
			
			}

		}
	}
</style>