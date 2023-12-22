<template>
	<div class="message-div" :id="id">
		<div class="profile-img-div">
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
  grid-template: auto auto / 1fr 2fr;
  width: 95%;
  height: 98%;
  overflow: hidden;
  margin: 2% 0 0 5%;
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
  grid-template: fit-content fit-content / 1fr 3fr;
  width: 100%;
  height: auto;
}

.user-info-div {
  display: flex;
  flex-direction: row;
}

.text-div {
  display: flex;
  flex-direction: row;
  height: fit-content;
  width: 100%;
}

h4 {
	font-size: 1em;
	color: #e9e8e8;
}

h5 {
	font-size: 0.5em;
	color: #c5c5c5;
	padding: 2%;
}

p {
	font-size: 0.75em;
	color:rgb(240, 240, 240);
	height: auto;
}
</style>
