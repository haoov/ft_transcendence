<script setup lang="ts">
	import { ChatEvents, type User } from '@/utils';
	import profileIcon from '@/assets/images/profileIcon.png';
	import messageIcon from '@/assets/images/message-50.png';
	import playIcon from '@/assets/images/racket-50.png';
	import blockIcon from '@/assets/images/status-blocked-32.png';
	import unblockIcon from '@/assets/images/unblock-50.png';
	import { socketManager } from '@/SocketManager';
	import router from '@/router';
	import { Channel, chat } from '@/chat';

	const props = defineProps<{user: User, channel: Channel}>();

	function setAdmin() {
		socketManager.emit('chat', ChatEvents.setAdmin, {
			channelId: props.channel.getId(),
			userId: props.user.id,
		});
	}
	
	function mute() {
		console.log('Mute User');
		socketManager.emit('chat', ChatEvents.muteUser, {
			channelId: props.channel.getId(),
			userId: props.user.id,
		});
	}

	function kick() {
		socketManager.emit('chat', ChatEvents.kickUser, {
			channelId: props.channel.getId(),
			userId: props.user.id,
		});
	}

	function ban() {
		socketManager.emit('chat', ChatEvents.banUser, {
			channelId: props.channel.getId(),
			userId: props.user.id,
		});
	}

	function profile() {
		router.push(`/${props.user.username}`);
		chat.setChatMenu('none');
	}

	function play() {
		console.log('play')
		chat.setChatMenu('none');
	}

	function block() {
		console.log('block')
		chat.setChatMenu('none');
	}

	function message() {
		console.log('message')
		chat.setChatMenu('none');
	}

	interface Action {
		name: string;
		title: string;
		function: () => void;
		icon?: string;
	}

	const channelActions: Action[] = [
		{
			name: 'Set Admin',
			title: `Set ${props.user.username} as admin`,
			function: setAdmin,
		},
		{
			name: 'Mute',
			title: `Mute ${props.user.username}`,
			function: mute,
		},
		{
			name: 'Kick',
			title: `Kick ${props.user.username}`,
			function: kick,
		},
		{
			name: 'Ban',
			title: `Ban ${props.user.username}`,
			function: ban,
		},
	];

	const userActions: Action[] = [
		{
			name: 'Profile',
			title: 'Go to profile',
			function: profile,
			icon: profileIcon
		},
		{
			name: 'Play',
			title: `Invite ${props.user.username} to play`,
			function: play,
			icon: playIcon
		},
		{
			name: 'Message',
			title: `Send direct message to ${props.user.username}`,
			function: message,
			icon: messageIcon
		},
		{
			name: 'Block',
			title: `Block ${props.user.username}`,
			function: block,
			icon: blockIcon
		},
	];
</script>

<template>
	<div id="profileMenu"
		v-if="user">
		<div id="user">
			<div id="userInfos">
				<img id="avatar" :src="user.avatar">
				<div id="username">{{ user.username }}</div>
			</div>
			<div id="userActions">
				<div v-for="action in userActions"
					class="action"
					v-on:click="action.function"
					:title="action.title">
					<img :src="action.icon">
				</div>
			</div>
		</div>
		<div id="channel">
			<div id="channelActions">
				<button v-for="action in channelActions"
					class="action"
					v-on:click="action.function"
					:title="action.title">
					{{ action.name }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
	#profileMenu {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: 300px;
		gap: 30px;
		padding: 30px;
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		background-color: var(--c-surface);

		#user {
			display: flex;
			flex-direction: column;
			gap: 20px;

			#userInfos {
				display: flex;
				align-items: center;
				gap: 10px;

				#avatar {
					width: 70px;
					height: 70px;
					border-radius: 50%;
				}

				#username {
					font-weight: 700;
				}
			}

			#userActions {
				display: flex;
				gap: 5px;

				.action {
					display: flex;
					border-radius: 50%;

					&:hover {
						background-color: var(--c-black-light);
						box-shadow: 0 0 0 0.4rem var(--c-black-light);
					}
					&:active {
						transform: scale(0.9);
					}

					img {
						width: 25px;
						height: 25px;
					}
				}
			}
		}

		#channel {
			display: flex;
			flex-direction: column;

			#channelActions {
				display: flex;
				flex-direction: column;
				gap: 6px;

				.action {
					padding: 7px;
					border-radius: 0.5rem;
					border: none;
					background-color: var(--c-black-light);
					font-weight: 700;
					cursor: pointer;
					transition: all 0.3s ease-in-out;

					&:hover {
						scale: 1.1;
					}
					&:active {
						scale: 0.9;
					}
				}
			}
		}
	}
</style>