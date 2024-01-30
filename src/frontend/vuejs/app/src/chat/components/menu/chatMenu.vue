<script setup lang="ts">
	import { Channel, chat } from '@/chat'
	import v_channelsMenu from './channelsMenu.vue'
	import v_settingsMenu from './settingsMenu.vue'
	import v_usersMenu from './usersMenu.vue'
	import v_profileMenu from './profileMenu.vue'
	import type { User, UserRelation } from '@/utils';
	import { ref, type Ref } from 'vue';

	const props = defineProps<{channel: Channel | undefined}>();
	const selectedUser: Ref<UserRelation | undefined> = ref<UserRelation>();
	function selectUser(user: UserRelation) {
		selectedUser.value = user;
		chat.setChatMenu('profile');
	}
</script>

<template>
	<Transition
		tag="div"
		id="displayMenu"
		name="displayMenu">
		<div
			v-if="chat.getChatMenu().value != 'none'"
			v-on:click="chat.setChatMenu('none')">
			<v_channelsMenu
				v-if="chat.getChatMenu().value == 'channels'"
				v-on:click.stop>
			</v_channelsMenu>
			<v_settingsMenu
				v-if="chat.getChatMenu().value == 'settings'"
				v-on:click.stop
				:channel="channel">
			</v_settingsMenu>
			<Suspense>
				<v_usersMenu
					v-if="chat.getChatMenu().value == 'users'"
					v-on:click.stop
					:channel="channel"
					v-on:selectUser="selectUser">
				</v_usersMenu>
			</Suspense>
			<v_profileMenu
				v-if="chat.getChatMenu().value == 'profile' && channel && selectedUser"
				v-on:click.stop
				:user="selectedUser"
				:channel="channel">
			</v_profileMenu>
		</div>
	</Transition>
</template>

<style scoped>
	#displayMenu {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: transparent;
		backdrop-filter: blur(5px);
	}

	.displayMenu-enter-active,
	.displayMenu-leave-active {
		transition: all 0.3s ease-in-out;
	}

	.displayMenu-enter-from,
	.displayMenu-leave-to {
		opacity: 0;
		transform: scale(0);
	}

	.displayMenu-enter-to,
	.displayMenu-leave-from {
		opacity: 1;
		transform: scale(1);
	}
</style>
