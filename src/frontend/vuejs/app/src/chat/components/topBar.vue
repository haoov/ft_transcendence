<script setup lang="ts">
	import { chat, type Channel, type ChatMenu } from '@/chat';
	import { socketManager } from '@/SocketManager';
	import actionsIcon from '@/assets/images/actionsIcon.png';
	import { ref, type Ref } from 'vue';
import notify from '@/notify/notify';

	const props = defineProps<{channel: Channel | undefined}>();
	const actionsMenu: Ref<boolean> = ref<boolean>(false);

	function setMenu(menu: ChatMenu) {
		chat.setChatMenu(menu);
		actionsMenu.value = false;
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
</script>

<template>
	<div id="channel-bar"
		v-if="channel">
		<img id="channelIcon"
			:src="channel?.getIcon(socketManager.getUser())">
		<span id="channelName">{{ channel.getTitle(socketManager.getUser()) }}</span>
		<div id="actions">
			<img id="actionsIcon"
				:src="actionsIcon"
				v-on:click="actionsMenu = !actionsMenu">
			<Transition id="showActions"
				name="showActions">
				<div id="actionsList"
					v-if="actionsMenu">
					<div id="userButton"
						v-on:click="setMenu('users')">
						Users
					</div>
					<div id="editButton"
						v-on:click="setMenu('settings')">
						Edit
					</div>
					<div>Leave</div>
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

		#channelIcon {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			border: 1px solid var(--c-black-light);
		}

		#channelName {
			font-size: large;
			font-weight: bold;
		}

		#actions {
			position: relative;
			display: inline-block;

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