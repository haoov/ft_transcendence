<script setup lang="ts">
	import { ChatEvents, ServerEvents, type User, type UserRelation } from '@/utils';
	import profileIcon from '@/assets/images/profileIcon.png';
	import messageIcon from '@/assets/images/message-50.png';
	import playIcon from '@/assets/images/racket-50.png';
	import blockIcon from '@/assets/images/status-blocked-32.png';
	import unblockIcon from '@/assets/images/unblock-50.png';
	import offline from '@/assets/images/status-offline-32.png';
	import online from '@/assets/images/status-online-32.png';
	import playing from '@/assets/images/status-playing-32.png';
	import { socketManager } from '@/SocketManager';
	import router from '@/router';
	import { Channel, chat } from '@/chat';
	import { computed, ref, toRef } from 'vue';
	import axios from 'axios';

	const props = defineProps<{user: UserRelation, channel: Channel}>();
	const userRef = toRef(props, 'user');
	const me = ref<User>(socketManager.getUser());

	socketManager.addEventListener("user", ServerEvents.dataChanged, async (user: User) => {
		if (user.id == props.user.id || user.id == me.value.id) {
			userRef.value = (await chat.getChannelRelations(props.channel)).filter((relation) => relation.id == userRef.value.id)[0];
			me.value = socketManager.getUser();
		}
	});

	function setAdmin() {
		socketManager.emit('chat', ChatEvents.setAdmin, {
			channelId: props.channel.getId(),
			userId: userRef.value.id,
		});
	}
	
	function mute() {
		console.log('Mute User');
		socketManager.emit('chat', ChatEvents.muteUser, {
			channelId: props.channel.getId(),
			userId: userRef.value.id,
		});
	}

	function kick() {
		socketManager.emit('chat', ChatEvents.kickUser, {
			channelId: props.channel.getId(),
			userId: userRef.value.id,
		});
	}

	function ban() {
		socketManager.emit('chat', ChatEvents.banUser, {
			channelId: props.channel.getId(),
			userId: userRef.value.id,
		});
	}

	function profile() {
		router.push(`/${userRef.value.username}`);
		chat.setChatMenu('none');
	}

	function play() {
		chat.setChatMenu('none');
		socketManager.invite(userRef.value.id);
	}

	async function block() {
		chat.setChatMenu('none');
		await axios.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/block?id=${userRef.value.id}`)
			.catch( (err) => { console.log(err) });
	}

	async function unblock() {
		chat.setChatMenu('none');
		await axios.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/unblock?id=${userRef.value.id}`)
			.catch( (err) => { console.log(err) });
	}

	function message() {
		console.log('message')
		chat.setChatMenu('none');
	}

	function displayActions(action: string) {
		 const admins = props.channel.getAdmins().map(admin => admin.id);
		const owner = props.channel.getCreatorId();
		if (action == "Play" || action == "Message")
			return (me.value.id != userRef.value.id && !userRef.value.blocking);
		if (action == "Block")
			return (me.value.id != userRef.value.id && !userRef.value.blocked);
		if (action == "Unblock")
			return (me.value.id != userRef.value.id && userRef.value.blocked);
		if (action == "Set Admin" || action == "Mute" || action == "Kick" || action == "Ban")
			return (props.channel.getMode() != "Private"
				&& me.value.id != userRef.value.id
				&& owner != userRef.value.id
				&& admins.includes(me.value.id));
		return (true);
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
			title: `Set ${userRef.value.username} as admin`,
			function: setAdmin,
		},
		{
			name: 'Mute',
			title: `Mute ${userRef.value.username}`,
			function: mute,
		},
		{
			name: 'Kick',
			title: `Kick ${userRef.value.username}`,
			function: kick,
		},
		{
			name: 'Ban',
			title: `Ban ${userRef.value.username}`,
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
			title: `Invite ${userRef.value.username} to play`,
			function: play,
			icon: playIcon
		},
		{
			name: 'Message',
			title: `Send direct message to ${userRef.value.username}`,
			function: message,
			icon: messageIcon
		},
		{
			name: 'Block',
			title: `Block ${userRef.value.username}`,
			function: block,
			icon: blockIcon
		},
		{
			name: 'Unblock',
			title: `Unblock ${userRef.value.username}`,
			function: unblock,
			icon: unblockIcon
		},
	];

	const authorizedUserAction = computed(() => {
		return userActions.filter(action => displayActions(action.name));
	});

	const authorizedChannelAction = computed(() => {
		return channelActions.filter(action => displayActions(action.name));
	});

	const statusIcon = computed(() => {
		if (userRef.value.blocked)
			return (blockIcon);
		if (userRef.value.status == "undefined" || userRef.value.status == "offline")
			return (offline);
		if (userRef.value.status == "playing")
			return (playing);
		else
			return (online);
	});

</script>

<template>
	<div id="profileMenu"
		v-if="user">
		<div id="user">
			<div id="userInfos">
				<div id="avatarContainer">
					<img id="avatar" :src="userRef.avatar">
					<img v-if="userRef.id == me.id || (userRef.friend == true && !userRef.blocking)" id="avatar-icon" :src="statusIcon"/>
				</div>
				<div id="username">{{ userRef.username }}</div>
			</div>
			<div id="userActions">
				<div v-for="action in authorizedUserAction"
					class="action"
					v-on:click="action.function"
					:title="action.title">
					<img :src="action.icon">
				</div>
			</div>
		</div>
		<div id="channel">
			<div id="channelActions">
				<button v-for="action in authorizedChannelAction"
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

				#avatarContainer {
					position: relative;
  					display: inline-block;
				}

				#avatar {
					width: 70px;
					height: 70px;
					border-radius: 50%;
				}
				#avatar-icon {
					position: absolute;
					bottom: 0.5rem;
					right: 0.5rem;
					width: 2rem;
					height: 2rem;
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