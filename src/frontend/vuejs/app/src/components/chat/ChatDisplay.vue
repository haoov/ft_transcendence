<template>
	<div class="chat-display-div">
		<ChatHeader :channel="store.activeChannel"></ChatHeader>
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
import { Suspense, inject, computed, onMounted, ref, watch } from 'vue';

const data : any = inject('$data');
const store = data.getStore();

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