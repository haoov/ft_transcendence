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
  grid-template-columns: 1fr 10fr;
}

.profile-img-div {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	overflow: hidden;
	display: inline-flex;
}
.profile-img-div img {
  max-width: 100%;
  max-height: 100%;
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
  font-size: 1em !important ;
  color: #e9e8e8 !important ;
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: .05em !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  font-family: Oswald,system-ui !important;
}

h5 {
    font-size: .5em;
    color: #c5c5c5;
    margin: 3px 0 0 5px;
}

p {
	font-size: 0.75em;
	color:rgb(240, 240, 240);
	height: auto;
}
</style>
