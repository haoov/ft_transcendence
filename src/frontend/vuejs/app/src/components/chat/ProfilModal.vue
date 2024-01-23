<template>
<div class="profile-modal-div">
	<div class="profile-div">
		<div class="profile-img-div">
			<img :src="profilePic" alt="Profile Picture" >
		</div>
		<div class="profile-info-div">
			<div class="profile-name">{{ username }}</div>
			<div class="profile-status">{{ status }} <span :class=classStatus>●</span></div>
		</div>
	</div>
	<div class="btn-div">
		<button
			class="btn-primary"
			v-for="option in options"
			:key="option.action"
			@click="option.function"
			:title="option.title"
		>{{ option.action }}
		</button>
	</div>
</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const $data : any = inject('$data');
const store = $data.getStore();
const currentUser = await $data.getCurrentUser();
const user = await $data.getUserById(store.userIdClicked);
const profilePic = user.avatar;
const username = user.username;
const status = user.status;
const classStatus = (user.status === 'offline' || user.status === 'undefined' ) ? 'logged-out' : 'logged-in';
const router = useRouter();

const goToProfile = async () => {
	const user = await $data.getUserById(store.userIdClicked);
	router.push(`/${user.username}`);
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
	},
	{
		action: 'Game',
		function: inviteToGame,
		title: 'Invite to game',
	},
	{
		action: 'Block',
		function: blockUser,
		title: 'Block user',
	},
	{
		action: 'Message',
		function: sendDirectMessage,
		title: 'Send direct message',
	},
]

</script>

<style scoped>
.profile-modal-div {
	width: 350px;
	background: linear-gradient(#212121, #212121) padding-box,
	linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
	border: 2px solid transparent;
	padding-top: 32px;
  padding-right: 24px;
  padding-bottom: 32px;
  padding-left: 28px;
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

.profile-div {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.profile-info-div {
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	font-family: Overpass;
	font-size: 18px;
	font-weight: 700;
}

.profile-name {
	font-family: inherit;
	font-size: inherit;
	font-weight: inherit;
}

.profile-status {
	font-family: inherit;
	font-size: inherit;
	font-weight: inherit;
}

.logged-in {
	color: #00ff00;
}
.logged-out {
	color: #ff0000;
}

.profile-img-div {
	width: 75px;
	height: 75px;
	border-radius: 50%;
	overflow: hidden;
	display: inline-flex;
}

.profile-img-div img {
	max-width: 100%;
	max-height: 100%;
	object-fit: cover;
}

.btn-div {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.btn-primary {
    display: flex;
    justify-content: center;
    font-family: inherit;
    color: #717171;
    font-weight: 600;
    width: 23%;
    background: #313131;
    border: 1px solid #414141;
    padding: 12px 16px;
    font-size: inherit;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 6px;
}

.btn-primary:hover {
	background-color: #fff;
	border-color: #fff;
}


</style>