<template>
	<div class="chat-display-div">
		<ChatHeader 
			:channel="store.activeChannel"
		></ChatHeader>
		<Suspense>
			<MessageDisplay
				:channel="store.activeChannel"
				:messages="store.messages"
			></MessageDisplay>
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
import { socketManager } from '@/SocketManager';
import { ChatEvents, ServerEvents } from '@/utils';

const data : any = inject('$data');
const store = data.getStore();

async function recievedMessage(data : any) {
	console.log(data);
	const blockedUsers = await data.getBlockedUsers();
	if (store.activeChannel.id !== data.message.channelId) {
		return;
	}
	if (!blockedUsers.some((blockedUser : any) => blockedUser.id === data.sender.id)) {
		store.messages.push(data);
	}
};

onMounted(() => {
	if( socketManager.hasEventListener("chat", ChatEvents.newMessageReceived)) {
		socketManager.removeEventListener("chat", ChatEvents.newMessageReceived, recievedMessage);
	}
});

socketManager.addEventListener("user", ServerEvents.dataChanged, async () => {
	if (store.activeChannel) {
		data.loadMessagesByChannel(store.activeChannel.id);
	}
});

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