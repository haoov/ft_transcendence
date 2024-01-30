<script setup lang="ts">
	import { chat, type ChannelParams, type ChannelData } from '@/chat'
	import { socketManager } from '@/SocketManager';
	import { ref, type Ref } from 'vue';
	import v_selector from '@/components/selector.vue';
	import v_joinMenu from '@/chat/components/menu/joinMenu.vue';
	import v_addUsers from '@/chat/components/menu/addUsers.vue';
	import type { User } from '@/utils';

	const subMenu: Ref<string> = ref('Create');
	const channelParams: ChannelParams = {
		name: '',
		mode: 'Public',
		creatorId: socketManager.getUser().id,
		users: [socketManager.getUser()],
	}

	let channelTOJoin: ChannelData;

	function addUser(user: User) {
		channelParams.users.push(user);
	}

	function removeUser(user: User) {
		const index: number = channelParams.users.indexOf(user);
		if (index != -1)
			channelParams.users.splice(index, 1);
	}

	function channelSelected(channel: ChannelData) {
		channelTOJoin = channel;
	}

	function submitButton() {
		if (subMenu.value == 'Create') {
			chat.createChannel(channelParams);
		}
		else if (subMenu.value == 'Join') {
			chat.joinChannel(channelTOJoin, socketManager.getUser());
		}
		chat.setChatMenu('none');
	}
</script>

<template>
	<!--CHANNELS MENU-->
	<div id="channelsMenu"
		v-if="chat.getChatMenu().value == 'channels'">
		<div id="menuSelection">
			<span :class="`subMenuSelector ${subMenu == 'Create' ? 'active' : ''}`"
				v-on:click="subMenu = 'Create'">
				Create
			</span>
			<span :class="`subMenuSelector ${subMenu == 'Join' ? 'active' : ''}`"
				v-on:click="subMenu = 'Join'">
				Join
			</span>
		</div>
		<!--NEW CHANNEL-->
		<div class="subMenu"
			v-if="subMenu == 'Create'">
			<v_selector
				label="Channel Mode :"
				:values="['Public', 'Private', 'Protected', 'Secret']"
				:preSelected="channelParams.mode"
				@select="(value) => {channelParams.mode = value}">
			</v_selector>
			<label class="inputLabel">
				Channel Name :
				<input id="channelName"
					class="channelInput"
					type="text"
					autocomplete="off"
					placeholder="Channel Name"
					v-model="channelParams.name">
			</label>
			<Suspense>
				<v_addUsers
					:channelParams="channelParams"
					:channel="undefined"
					v-on:add="addUser"
					v-on:remove="removeUser">
				</v_addUsers>
			</Suspense>
		</div> <!--END NEW CHANNEL-->
		<!--JOIN CHANNEL-->
		<Suspense>
			<v_joinMenu
				v-if="subMenu == 'Join'"
				v-on:selectChannel="channelSelected">
			</v_joinMenu>
		</Suspense><!--END JOIN CHANNEL-->
		<button id="submitButton"
			v-on:click="submitButton()">
			{{ subMenu }}
		</button>
	</div> <!--END CHANNELS MENU-->
</template>

<style scoped>
	#channelsMenu {
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

	#menuSelection {
		display: flex;
		width: 100%;
		justify-content: space-evenly;
	}

	.subMenu {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 30px;
	}

	.subMenuSelector {
		cursor: pointer;
	}

	.subMenuSelector.active {
		text-decoration: underline;
		text-decoration-color: var(--c-pink);
		text-decoration-thickness: 2px;
		text-underline-offset: 5px;
		animation: underline-animation 10s infinite
	}

	@keyframes underline-animation {
		0% {
			text-decoration-color: var(--c-pink);
		}
		50% {
			text-decoration-color: var(--c-teal);
		}
		100% {
			text-decoration-color: var(--c-pink);
		}
	}

	.inputLabel {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 1.4rem;
		color: var(--c-grey-light);
	}

	.channelInput {
		width: 80%;
		padding: 3% 7%;
		border-radius: 8px;
		color: var(--c-white);
		background-color: transparent;
		border: 1px solid var(--c-grey);
	}

	#submitButton {
		background-color: var(--c-black-light);
		border: 1px solid var(--c-black-light);
		padding: 12px 16px;
		cursor: pointer;
		border-radius: 6px;
	}
</style>