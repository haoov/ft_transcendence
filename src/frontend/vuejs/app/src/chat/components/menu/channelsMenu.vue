<script setup lang="ts">
	import { chat, type ChannelParams, type ChannelData } from '@/chat'
	import { socketManager } from '@/SocketManager';
	import { computed, reactive, ref, type Ref } from 'vue';
	import v_selector from '@/components/selector.vue';
	import v_joinMenu from '@/chat/components/menu/joinMenu.vue';
	import v_addUsers from '@/chat/components/menu/addUsers.vue';
	import type { User } from '@/utils';

	const subMenu: Ref<string> = ref('Create');
	const channelParams: ChannelParams = reactive({
		name: '',
		mode: 'Public',
		creatorId: socketManager.getUser().id,
		password: '',
		users: [socketManager.getUser()],
		admins: [socketManager.getUser()],
	});

	async function createChannel() {
		if (channelParams.mode == 'Private') {
			chat.sendPrivateMessage(channelParams.users[1]);
			chat.setChatMenu('none');
			return;
		}
		if (await chat.createChannel(channelParams) == false)
			return;
		chat.setChatMenu('none');
	}

	function addUser(user: User) {
		channelParams.users.push(user);
	}

	function removeUser(user: User) {
		const index: number = channelParams.users.indexOf(user);
		if (index != -1)
			channelParams.users.splice(index, 1);
	}

	const disableButton = computed(() => {
		if (channelParams.mode == 'Public' || channelParams.mode == 'Secret') {
			if (channelParams.name.length == 0)
				return true;
		}
		if (channelParams.mode == 'Protected') {
			if (channelParams.name.length == 0 || !channelParams.password)
				return true;
		}
		if (channelParams.mode == 'Private' && channelParams.users.length < 2) {
				return true;
		}
		return false;
	});

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
			<div v-if="channelParams.mode != 'Private'" class="channelInfos">
				<label class="inputLabel">
					Channel Name :
					<input id="channelName"
						class="channelInput"
						type="text"
						autocomplete="off"
						placeholder="Channel Name"
						v-model="channelParams.name">
				</label>
				<label class="inputLabel"
					v-if="channelParams.mode == 'Protected'">
					Password :
					<input id="channelName"
						class="channelInput"
						type="password"
						autocomplete="off"
						placeholder="Channel Name"
						v-model="channelParams.password">
				</label>
				<Suspense>
					<v_addUsers
					:privateChannel="false"
					:channelParams="channelParams"
					:channel="undefined"
					v-on:add="addUser"
					v-on:remove="removeUser">
					</v_addUsers>
				</Suspense>
			</div>
			<div v-if="channelParams.mode == 'Private'" class="channelInfos">
				<Suspense>
					<v_addUsers
					:privateChannel="true"
					:channelParams="channelParams"
					:channel="undefined"
					v-on:add="addUser"
					v-on:remove="removeUser">
					></v_addUsers>
				</Suspense>
			</div>
		</div> 
		<!--END NEW CHANNEL-->
		<!--JOIN CHANNEL-->
		<Suspense>
			<v_joinMenu v-if="subMenu == 'Join'"></v_joinMenu>
		</Suspense>
		<!--END JOIN CHANNEL-->
		<button id="submitButton"
			:disabled="disableButton"
			v-if="subMenu == 'Create'"
			v-on:click="createChannel()">
			Create
		</button>
	</div>
	<!--END CHANNELS MENU-->
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

	.channelInfos {
		display: flex;
		flex-direction: column;
		gap: 20px;
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
		color: #fff;
		background-color: var(--c-pink);
		border: 1px solid var(--c-pink);
		padding: 12px 16px;
		cursor: pointer;
		border-radius: 6px;
		width: 25%;

		&:hover:not(:disabled) {
			transform: scale(1.05);
		}
		&:disabled {
			background-color: var(--c-black-light);
			border: 1px solid var(--c-black-light);
			cursor: not-allowed;
			transform: none !important;
		}
		&:active {
			transform: scale(0.9);
		}
	}
</style>