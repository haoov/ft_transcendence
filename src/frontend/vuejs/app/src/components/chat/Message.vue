<template>
	<div class="message-div" :id="id">
		<div :class=classDiv @click=openProfilModal>
			<img :src="profilePic" alt="Profile Picture" >
		</div>
		<div class="core-message-div">
			<div class="user-info-div">
				<h4>{{ username }}</h4>
				<h5>{{ timestamp }}</h5>
			</div>
			<div class="text-div">
				<p>{{ message }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { User } from '@/utils';
import moment from 'moment-timezone';
import { inject, computed } from 'vue';

const props = defineProps<{
	data: any,
	currentUser: User,
	id: Number
}>();

const $data : any = inject('$data');
const username : string = props.data.sender.username;
const profilePic : string = props.data.sender.avatar;
const userId : number = props.data.sender.id;
const message : string = props.data.message.text;
const DateRawStamp : string = props.data.message.time;
const timeFr = moment.tz(DateRawStamp, 'Europe/Paris');
const timestamp : string = timeFr.format('HH:mm:ss');
const id : string = props.id.toString();
const currentUserId = props.currentUser.id;
const classDiv = computed(() => {
	if(userId === currentUserId)
		return 'profile-img-div disabled';
	return 'profile-img-div';
});

const openProfilModal = () => {
	if(userId !== currentUserId)
		$data.openProfileModal(userId);
}

</script>

<style scoped>
.message-div {
  display: grid;
  grid-template-columns: 1fr 10fr;
}

.profile-img-div {
	width: 55px;
	height: 55px;
	border-radius: 50%;
	overflow: hidden;
	display: inline-flex;
	cursor: pointer;
}
.profile-img-div.disabled {
	cursor: default;
}
.profile-img-div img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.core-message-div {
  display: flex;
  flex-direction: column;
  margin: 0 0 0 20px;
}

.user-info-div {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 5px;
}

.text-div {
  display: flex;
  flex-direction: row;
  height: fit-content;
  width: 100%;
  overflow-wrap: break-word;
  word-break: break-all;
}

h4 {
  font-size: 1em;
  color: #e9e8e8;
  text-transform: none;
  margin-top: 0;
  margin-bottom: 0;
  font-family: Overpass;
  font-weight: 600;
}

h5 {
    font-size: 0.6em;
    color: #c5c5c5;
    margin: 3px 0 0 5px;
}

p {
	font-size: 1em;
	color:rgb(240, 240, 240);
	height: auto;
}

.test-transi-enter-from,
.test-transi-leave-to {
	opacity: 0;
}

.test-transi-enter-active,
.test-transi-leave-active {
	transition: opacity 0.5s ease-in-out;
}

</style>
