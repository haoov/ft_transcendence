<template>
	<div class="chat-display-div">
		<ChatHeader></ChatHeader>
		<Suspense>
			<MessageDisplay></MessageDisplay>
		</Suspense>
		<Suspense>
			<InputBar></InputBar>
		</Suspense>
	</div>
</template>

<script setup lang="ts">
import InputBar from './InputBar.vue';
import MessageDisplay from './MessagesDisplay.vue';
import ChatHeader from './ChatHeader.vue';
import { Suspense } from 'vue';

</script>

<style scoped>

.chat-display-div {
  display: grid;
  grid-template-rows: 1fr minmax(auto, 550px) minmax(25px, auto);
  align-content: stretch;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 0;
}

</style>