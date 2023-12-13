<template>
	<div class="message-div">
		<div class="profile-img-div">
			<img src="https://picsum.photos/200/300" alt="Profile Picture">
		</div>
		<div class="core-message-div">
			<div class="user-info-div">
				<h3>aboulest</h3>
				<h4>00:25:03</h4>
			</div>
			<div class="text-div">
				<p>Message</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

	// const message = defineProps(['message']).message;
	// console.log(message);

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
  background-color: #527a3f;
  display: flex;
  align-items: center;
  justify-content: center;
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
