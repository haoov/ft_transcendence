<template>
	<div class="message-div" id="{{ index }}">
		<div class="profile-img-div">
			<!-- <img src="https://picsum.photos/200/300" alt="Profile Picture"> -->
			<img :src="profilePic" alt="Profile Picture">
		</div>
		<div class="core-message-div">
			<div class="user-info-div">
				<h3>{{ username }}</h3>
				<h4>{{ timestamp }}</h4>
			</div>
			<div class="text-div">
				<p>{{ message }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue';
	/*Message received:
		return {
			sender:{
				name: senderName,
				avatar: profilePic,
			},
			message: {
				text : message.message,
				time: message.timestamp,
			}
		}
	*/
	const props : any = defineProps({
		message: Object,
		index: Number
	});

	const username : string = props.message.sender.name;
	const profilePic : string = props.message.sender.avatar;
	const message : string = props.message.message.text;
	const timestamp : string = props.message.message.time;
	const index : number = props.index;
	// console.log(props.username);

</script>

<style scoped>
.message-div {
  display: grid;
  grid-template-columns: 1fr 3fr;
  width: 100%;
  overflow: hidden;
  margin: 10px;
}

.profile-img-div {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-img-div img {
  max-width: 100%;
  max-height: 100%;
}
.core-message-div {
  display: grid;
  grid-template-rows: 1fr 3fr;
  width: 100%;
  height: 100%;
}

.user-info-div {
  display: flex;
  flex-direction: row;
  padding: 0 2px;
}

h3 {
  font-size: 1.5em;
  color: #707070;
}

h4 {
  font-size: 1em;
  color: #a7a7a7;
}

p {
	color:black;
}
</style>
