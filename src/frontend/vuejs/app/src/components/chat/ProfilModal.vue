<template>
<div class="profile-modal-div">
	<div class="profile-div">
		<div class="profile-img-div">
			<img :src="profilePic" alt="Profile Picture" >
		</div>
		<div class="profile-info-div">
			<div class="profile-name">Name</div>
			<div class="profile-status">Status</div>
		</div>
	</div>
	<div class="btn-div">
		<button
			class="btn btn-primary"
			v-for="option in options"
			:key="option.action"
			@click="option.function"
		>{{ option.action }}
		</button>
	</div>
</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const goToProfile = () => {
	console.log('go to profile')
}
const inviteToGame = () => {
	console.log('invite to game')
}
const blockUser = () => {
	console.log('block user')
}
const sendDirectMessage = () => {
	console.log('send direct message')
}
const options = [
	{
		action: 'Profile',
		function: goToProfile(),
	},
	{
		action: 'Invite to game',
		function: inviteToGame(),
	},
	{
		action: 'Block user',
		function: blockUser(),
	},
	{
		action: 'Send direct message',
		function: sendDirectMessage(),
	},
]

const $data : any = inject('$data');
const store = $data.getStore();


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
  font-family: inherit;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  border-radius: 16px;
  background-size: 200% 100%;
  animation: gradient 10s ease infinite;
}

</style>