<template>
	<div class="chat-display-div">
		<ChatHeader></ChatHeader>
		<MessageDisplay></MessageDisplay>
		<Suspense><InputBar></InputBar></Suspense>
	</div>
</template>

<script setup lang="ts">
import InputBar from './InputBar.vue';
import MessageDisplay from './MessagesDisplay.vue';
import ChatHeader from './ChatHeader.vue';

</script>

<style scoped>

.chat-display-div {
  display: grid;
  grid-template-rows: 1fr 6fr 0.5fr;
  align-content: stretch;
  width: 100%;
  height: 100%;
}

</style>