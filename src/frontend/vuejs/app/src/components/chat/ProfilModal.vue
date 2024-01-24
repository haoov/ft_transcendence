<template>
<div class="c-card" id="profile">
	<div class="c-card__body">
		<div class="u-display--flex u-justify--space-between">
			<div class="u-text--left">
				<div class="c-avatar-container u-ml--24">
					<img class="c-avatar c-avatar--lg" :src="profilePic"/>
					<img v-if="user" class="c-avatar-icon" :src="status" :title="statusTitle"/>
				</div>
				<div class="u-text--medium u-mt--16 u-text--overpass u-ml--24">{{ username }}</div>
				<span class="u-text--c-teal u-mt--16 u-text--small u-text--overpass u-ml--24">{{ email }} </span>
				<div class="u-ml--24 u-mt--4">
					<a v-for="option in options" @click="option.function" target="_blank">
					<img :src="option.icon" width='20em' height="20em" :alt="option.alt" :title="option.title">
				</a>
				</div>
			</div>
			<div class="u-text--right">
					<div class="u-mt--16 u-text--small u-text--overpass">Rank</div>
					<h2 class="u-text--oswald">Coucou</h2>
					<div class="u-mt--24 u-text--small u-text--overpass">Wins</div>
					<h2 class="u-text--oswald">coucou</h2>
			</div>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
import { inject, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { type SocketManager } from "@/SocketManager";
import {ServerEvents, type User} from '@/utils'
import racketIcon from '../../assets/images/racket-50.png';
import blockedIcon from '../../assets/images/status-blocked-32.png';
import messageIcon from '../../assets/images/message-50.png';
import profileIcon from '../../assets/images/profile-50.png';
import online from '../../assets/images/status-online-32.png';
import playing from '../../assets/images/status-playing-32.png';
import offline from '../../assets/images/status-offline-32.png';
import blocked from '../../assets/images/status-blocked-32.png';

const router = useRouter();
const $data : any = inject('$data');
const store = $data.getStore();
const socketManager: SocketManager = inject('socketManager') as SocketManager;
const currentUser = await $data.getCurrentUser();
const user = ref<User>(await $data.getUserById(store.userIdClicked));
const profilePic = ref<string>(user.value.avatar);
const username = ref<string>(user.value.username);
const email = ref<string>(user.value.email);
const isBlocked = ref<boolean>(false);
const blockedList = ref<User []>(await $data.getBlockedUsers());
const status = computed ( () => {
	if (user.value.status == 'blocked') {
		return blocked;
	}else if (user.value.status == 'online') {
		return online;
	} else if (user.value.status == 'playing') {
		return playing;
	} else if (user.value.status == 'offline') {
		return offline;
	}
});
const statusTitle = computed ( () => {
	if (user.value.status == 'blocked') {
		return 'Blocked';
	}else if (user.value.status == 'online') {
		return 'Online';
	} else if (user.value.status == 'playing') {
		return 'Playing';
	} else if (user.value.status == 'offline') {
		return 'Offline';
	}
});

socketManager.addEventListener("user", ServerEvents.dataChanged, async () => {
	user.value = await $data.getUserById(store.userIdClicked);
	blockedList.value = await $data.getBlockedUsers();
	blockedList.value.forEach((blockedUser: User) => {
		if (blockedUser.id == store.userIdClicked) {
			isBlocked.value = true;
		}
	});
});


const goToProfile = async () => {
	router.push(`/${user.value.username}`);
	$data.closeProfileModal();
}
const inviteToGame = () => {
	console.log('invite to game')
	router.push('/game');
	$data.closeProfileModal();
}
const blockUser = () => {
	console.log('block user')
	$data.blockUser(store.userIdClicked);
	$data.closeProfileModal();
}
const sendDirectMessage = () => {
	console.log('send direct message')
	$data.sendDirectMessage(store.userIdClicked);
	$data.closeProfileModal();
}

const options = [
	{
		action: 'Profile',
		function: goToProfile,
		title: 'Go to profile',
		icon: profileIcon,
		alt: 'profile-icon',
	},
	{
		action: 'Game',
		function: inviteToGame,
		title: 'Invite to game',
		icon: racketIcon,
		alt: 'invite-icon',
	},
	{
		action: 'Message',
		function: sendDirectMessage,
		title: 'Send direct message',
		icon: messageIcon,
		alt: 'message-icon',
	},
	{
		action: 'Block',
		function: blockUser,
		title: 'Block user',
		icon: blockedIcon,
		alt: 'block-icon',
	},
]

const actions = [
	{
		action: 'Admin',
		function: () => console.log('admin'),
		title: 'Make admin',
	},
	{
		action: 'Kick',
		function: () => console.log('kick'),
		title: 'Kick user',
	},
	{
		action: 'Ban',
		function: () => console.log('ban'),
		title: 'Ban user',
	},

]

</script>

<style scoped>
.c-card {
  width: 500px;
  background: linear-gradient(#212121, #212121) padding-box,
  linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
  border: 2px solid transparent;
  font-size: 14px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  border-radius: 16px;
  background-size: 200% 100%;
  animation: gradient 10s ease infinite;
}

.c-card__body, .c-card__header {
	padding: 2.4rem;
}

.u-display--flex {
	display: flex;
}

.u-justify--space-between {
	justify-content: space-between;
}

.u-text--left {
	text-align: left;
}

.c-avatar-container {
  position: relative;
  display: inline-block;
}

.c-avatar {
	display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4.8rem;
    height: 4.8rem;
    box-shadow: 0 0 3px,0 0 5px var(--c-black-light),0 0 7px var(--c-black-light),0 0 10px var(--c-black-light);
    border-radius: 50%;
    background: var(--lightest);
    color: var(--dark);
    object-fit: cover;
}

.c-avatar-icon {
	position: absolute;
	bottom: 0;
	right: 0;

}

.u-ml--24 {
	margin-left: 2.4rem;
}

.c-avatar--lg {
	width: 8.5rem;
	height: 8.5rem;
}

.u-text--medium {
	font-size: 2rem;
	color: var(--medium) !important;
}

.u-mt--16 {
	margin-top: 1.6rem;
}

.u-text--small {
	font-size: 1.4rem;
}

.u-text--overpass {
	font-family: Overpass, system-ui;
}

.u-ml--24 {
	margin-left: 2.4rem;
}

.u-mt--4 {
	margin-top: 0.4rem;
}

.u-text--right {
	text-align: right;
}

</style>