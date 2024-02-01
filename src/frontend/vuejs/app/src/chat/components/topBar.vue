<script setup lang="ts">
	import { chat, type Channel, type ChatMenu } from '@/chat';
	import { socketManager } from '@/SocketManager';
	import actionsIcon from '@/assets/images/actionsIcon.png';
	import { ref, type Ref, watchEffect, watch, computed } from 'vue';
	import { ServerEvents, type User, type UserRelation } from '@/utils';
	import eventBus from '@/composables/eventBus';
	import router from '@/router';
	import blocked from '@/assets/images/status-blocked-32.png';
	import offline from '@/assets/images/status-offline-32.png';
	import online from '@/assets/images/status-online-32.png';
	import playing from '@/assets/images/status-playing-32.png';
	import notify from '@/notify/notify';

	const props = defineProps<{channel: Channel}>();
	const actionsMenu: Ref<boolean> = ref<boolean>(false);
	const userRelations = ref<UserRelation[]>(await chat.getChannelRelations(props.channel));
	const otherUser = computed(() => {
		if (props.channel.getMode() == "Private")
			return userRelations.value.find((user) => user.id != socketManager.getUser().id);
		return undefined;
	});

	const statusIcon = computed(() => {
		if (otherUser.value) {
			if (otherUser.value.blocked)
				return (blocked);
			if (otherUser.value.status == "undefined" || otherUser.value.status == "offline")
				return (offline);
			if (otherUser.value.status == "playing")
				return (playing);
			else if (otherUser.value.status == "online")
				return (online);
		}
		return ("");
	});

	socketManager.addEventListener("user", ServerEvents.dataChanged, async (user: User) => {
		const userConcerned = userRelations.value.map((relation) => relation.id);
		if (userConcerned.includes(user.id)) {
			if (chat.checkChannel(props.channel))
				userRelations.value = await chat.getChannelRelations(props.channel);
		}
	});

	watchEffect(async () => {
		const channelRelations = await chat.getChannelRelations(props.channel);
		userRelations.value = channelRelations;
	});

	function setMenu(menu: ChatMenu) {
		chat.setChatMenu(menu);
		actionsMenu.value = false;
	}

	function clickOnAction() {
		if (props.channel && props.channel.getMode() == "Private")
			eventBus.emit('selectUser', otherUser.value);
		else 
			actionsMenu.value = !actionsMenu.value
	}

	function clickOnChannelName() {
		if (otherUser.value && props.channel && props.channel.getMode() == "Private")
			router.push(`/${otherUser.value.username}`);
		else if (props.channel)
			setMenu('users')
	}

	async function deleteChannel() {
		notify.newNotification("warning", {
			message: "Are you shure ?",
			by: `Delete channel ${props.channel?.getTitle(socketManager.getUser())}`,
			autoClose: false,
			buttons: [
				{
					text: "Yes",
					action: () => {
						if (props.channel == undefined)
							return;
						chat.deleteChannel(props.channel);
					}
				},
				{
					text: "No",
					action: () => {}
				}
			]
		});
		actionsMenu.value = false;
	}

	async function leaveChannel() {
		notify.newNotification("warning", {
			message: "Are you shure ?",
			by: `Leave channel ${props.channel?.getTitle(socketManager.getUser())}`,
			autoClose: false,
			buttons: [
				{
					text: "Yes",
					action: () => {
						if (props.channel == undefined)
							return;
						chat.leaveChannel(props.channel);
					}
				},
				{
					text: "No",
					action: () => {}
				}
			]
		});
		actionsMenu.value = false;
	}
</script>

<template>
	<div id="channel-bar"
		v-if="channel">
		<div id="channel-icon-container">
			<img id="channelIcon"
				:src="channel?.getIcon(socketManager.getUser())">
			<img v-if="channel.getMode() == 'Private' && otherUser?.friend == true && !otherUser?.blocking" id="statusIcon" :src="statusIcon">
		</div>
		<span id="channelName" @click="clickOnChannelName()">{{ channel.getTitle(socketManager.getUser()) }}</span>
		<div id="actions">
			<img id="actionsIcon"
				:src="actionsIcon"
				v-on:click="clickOnAction()">
			<Transition id="showActions"
				name="showActions">
				<div id="actionsList"
					v-if="actionsMenu"
					v-on:mouseleave="actionsMenu = false">
					<div id="userButton"
						v-on:click="setMenu('users')">
						Users
					</div>
					<div id="editButton"
						v-on:click="setMenu('settings')"
						v-if="channel.getCreatorId() == socketManager.getUser().id">
						Edit
					</div>
					<div
						v-on:click="leaveChannel()">
						Leave
					</div>
					<div
						v-on:click="deleteChannel()">
						Delete
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
	#channel-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 70px;
		padding: 10px;
		border-bottom: 1px solid var(--c-black-light);
		box-sizing: border-box;

		#channel-icon-container {
			position: relative;
			display: inline-block;
		}

		#channelIcon {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			border: 1px solid var(--c-black-light);
		}

		#statusIcon {
			position: absolute;
			bottom: 0.3rem;
			right: 0.3rem;
			width: 1.7rem;
			height: 1.7rem;
		}

		#channelName {
			font-size: large;
			font-weight: bold;
			cursor: pointer;
			&:hover {
					border-radius: 3px;
					background-color: var(--c-black-light);
					box-shadow: 0 0 0 0.4rem var(--c-black-light);
				}
			&:active {
				transform: scale(0.9);
			}
		}

		#actions {
			position: relative;
			display: inline-block;
			z-index: 1;

			#actionsIcon {
				width: 30px;
				height: 30px;
				border-radius: 50%;
				cursor: pointer;
				transition: all 0.3s ease-in-out;
				&:hover {
					background-color: var(--c-black-light);
					box-shadow: 0 0 0 0.4rem var(--c-black-light);
				}
				&:active {
					transform: scale(0.9);
				}
			}

			#showActions {
				position: absolute;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				padding: 10px;
				gap: 10px;
				right: 20px;
				width: 50px;
				background-color: var(--c-surface);
				border-radius: 0.8rem;
				box-shadow: 0 0 0 1px var(--c-black-light);

				div {
					cursor: pointer;
				}
			}
		}
	}

	.showActions-enter-active,
	.showActions-leave-active {
		transition: all 0.3s ease-in-out;
	}

	.showActions-enter-from,
	.showActions-leave-to {
		transform: scaleY(0);
	}

	.showActions-enter-to,
	.showActions-leave-from {
		transform: scaleY(1);
	}
</style>