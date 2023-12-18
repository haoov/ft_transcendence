<template>
	<div class="message-div" :id="id">
		<div class="profile-img-div">
			<!-- <img src="https://picsum.photos/200/300" alt="Profile Picture"> -->
			<img :src="profilePic" alt="Profile Picture">
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
	import { defineProps } from 'vue';

	const props : any = defineProps({
		data: Object,
		id: Number
	});

	const username : string = props.data.sender.name;
	const profilePic : string = props.data.sender.avatar;
	const message : string = props.data.message.text;
	const timestamp : string = props.data.message.time;
	const id : string = props.id.toString();

</script>

<style scoped>
.message-div {
  display: grid;
  grid-template-columns: 1fr 3fr;
  width: 100%;
  height: 100%;
  overflow: auto;
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
}

.text-div {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

h4 {
	font-size: 1.5em;
	color: #707070;
}

h5 {
	font-size: 1em;
	color: #a7a7a7;
	padding: 2%;
}

p {
	color:black;
}
</style>
