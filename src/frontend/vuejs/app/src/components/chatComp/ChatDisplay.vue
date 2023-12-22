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
  grid-template-rows: 1fr 6fr 0.5fr;
  align-content: stretch;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 8px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: #07cece;
  box-shadow:0 0 6px #07cece;
}

::-webkit-scrollbar-track:hover,
::-webkit-scrollbar-track:active {
  background-color: transparent;
}

</style>