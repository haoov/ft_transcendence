<script setup lang="ts">
	import { socketManager } from '@/SocketManager';
	import { chat, type Channel, type ChannelData } from '@/chat';
	import notify from '@/notify/notify';
	import { computed, ref, type Ref } from 'vue';
	import cancelIcon from '@/assets/images/cancelIcon.png';

	const joignableChannels: ChannelData[] = await chat.getJoinableChannels(socketManager.getUser());
	const password: Ref<string> = ref('');
	const search: Ref<string> = ref('');
	const result: Ref<ChannelData> = ref({} as ChannelData);

	const searchResults = computed((): ChannelData[] => {
		if (search.value.length == 0 || search.value == result.value.name) { 
			return [];
		} else {
			return joignableChannels.filter((channel: ChannelData) => {
				return channel.name.toLowerCase().startsWith(search.value.toLowerCase());
			});
		}
	});

	function selectChannel(channel: ChannelData) {
		result.value = channel;
		search.value = channel.name;
	}

	function cancelSelection() {
		search.value = '';
		result.value = {} as ChannelData;
	}

	function submitEvent() {
		if (!result.value) {
			notify.newNotification('error', {message:'You must select a channel to join'});
		}
		chat.joinChannel(result.value.id, socketManager.getUser(), password.value);
		chat.setChatMenu('none');
	}

</script>

<template>
	<div id="joinMenu">
		<div id="coreDiv">
			<label id="inputLabel">
				{{ result && Object.keys(result).length > 0 ? 'Selected channel' : 'Search channel :'}}
				<div class="inputContainer">
					<img id="searchIcon">
					<input :id="result && Object.keys(result).length > 0 ? 'searchChannelSelected' : 'searchChannel'"
						type="text"
						autocomplete="off"
						placeholder="Search..."
						v-model="search">
					<img v-if="result && Object.keys(result).length > 0" id="removeIcon" :src="cancelIcon" v-on:click="cancelSelection()">
				</div>
			</label>
			<div id="searchResults">
				<div
					class="searchResult"
					v-for="channel in searchResults"
					v-on:click="selectChannel(channel)"
				>
					<div class = "channelResult">
						<p>{{ channel.name }}</p>
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
		<div v-if="result.mode == 'Protected'" class="passwordDiv">
			<label class="inputLabel" for="password" id="inputLabel"> Password :</label>
			<input id="passwordInput"
				name="password"
				class="channelInput"
				type="password"
				autocomplete="off"
				placeholder="password"
				v-model="password"
			>
		</div>
	</div>
		<button id="submitButton"
			v-on:click="submitEvent()">
			Join
		</button>
	</div>
</template>

<style scoped>
	#coreDiv {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 20px;
	}

	.selectedDiv {
		width: 100%;
	}

	#cancelIcon {
		width: 20px;
		height: 20px;
	}

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

			#searchChannel, .channelInput {
				width: 80%;
				padding: 3% 7%;
				border-radius: 8px;
				color: var(--c-white);
				background-color: transparent;
				border: 1px solid var(--c-grey);
			}

			#searchChannelSelected {
				width: 80%;
				padding: 3% 7%;
				border-radius: 8px;
				color: var(--c-white);
				background-color: var(--c-black-light);
				border: 1px solid var(--c-pink);
			}

			.inputContainer {
				position: relative;
			}

			#removeIcon {
				position: absolute;
				top: 5px;
				right: 25px;
				cursor: pointer;
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

				&:hover {
					background-color: var(--c-black-light);
					color: var(--c-grey);
					border: var(--c-pink) 1px solid;
				}
				
				.channelResult {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					width: 100%;
				}
			}

			.selected {
				width: 90%;
				background-color: var(--c-black-light);
				color: var(--c-grey);
				border: var(--c-pink) 1px solid;
				border-radius: 7px;
				margin-top: 5px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 5px;
				font-size: small;
				cursor: pointer;
			}
		}

		.passwordDiv {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 5px;
			
			#inputLabel {
				display: flex;
				flex-direction: column;
				gap: 5px;
				font-size: 1.4rem;
				color: var(--c-grey-light);
			}
			
			#passwordInput {
				width: 80%;
				padding: 3% 7%;
				border-radius: 8px;
				color: var(--c-white);
				background-color: transparent;
				border: 1px solid var(--c-grey);
			}
		}

		#submitButton {
			background-color: var(--c-black-light);
			border: 1px solid var(--c-black-light);
			padding: 12px 16px;
			cursor: pointer;
			border-radius: 6px;
			width: 25%;

			&:hover:not(:disabled) {
				background-color: var(--c-grey-light);
				color: var(--c-black-light);
				border: 1px solid var(--c-pink);
			}
		}
	}
</style>