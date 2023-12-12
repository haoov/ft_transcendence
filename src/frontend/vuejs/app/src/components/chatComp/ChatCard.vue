
<template>
	<div class="chat-display-card">
		<ChatNavbar></ChatNavbar>
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
  border-radius: 30px;
  overflow: hidden;
  background: #e0e0e0;
  /* box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff; */
  box-shadow: 0 4px 8px 0 var(--c-black), 0 6px 20px 0 var(--c-blue-dark);
}
</style>