
<template>
	<div class="chat-display-card">
		<ChatNavbar ></ChatNavbar>
		<ChatDisplay></ChatDisplay>
	</div>
</template>

<script setup lang="ts">
	import ChatDisplay from './ChatDisplay.vue';
	import ChatNavbar from './ChatNavbar.vue';
</script>

<style scoped>
.chat-display-card {
  display: grid;
  grid-template-columns: 1fr 3fr;
  width: 70vh;
  height: 80vh;
  overflow: hidden;
  background: linear-gradient(
	  to right,
	  var(--c-black),
	  var(--c-blue-dark),
	  var(--c-black)
	  );
  border: 5px solid #fe019a;
  border-radius: 8px;
  box-shadow: 0 0 10px #fafafa;
}


</style>