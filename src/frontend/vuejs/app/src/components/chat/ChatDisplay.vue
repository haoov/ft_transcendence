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
import { Suspense, inject, onMounted } from 'vue';
import { socketManager } from '@/SocketManager';
import { ChatEvents, ServerEvents } from '@/utils';

interface Message {
	id : number;
	sender: {
		name: string;
		avatar: string;
	};
	message: {
		id: number;
		text: string;
		time: string;
	};
};

const storeManager : any = inject('$data');
const store = storeManager.getStore();

async function recievedMessage(data : any) {
	const blockedUsers = await storeManager.getBlockedUsers();
	const blockers = await storeManager.getBlockersList();
	if (store.activeChannel.id !== data.message.channelId) {
		return;
	}
	if (!blockedUsers.some((blockedUser : any) => blockedUser.id === data.sender.id)
	&& !blockers.some((blocker: any) => blocker.id === data.sender.id)) {
		console.log('[Data received] ->', data);
		const newMsg = {
			sender: {
				name: data.sender.username,
				avatar: data.sender.avatar,
			},
			message: {
				id: data.message.id,
				text: data.message.text,
				time: data.message.time,
			}
		}
		store.messages = [...store.messages, newMsg];
	}
};

onMounted(() => {
	if(!socketManager.hasEventListener("chat", ChatEvents.newMessageReceived)) {
		socketManager.addEventListener("chat", ChatEvents.newMessageReceived, recievedMessage);
	}
});

socketManager.addEventListener("user", ServerEvents.dataChanged, async () => {
	if (store.activeChannel) {
		storeManager.loadMessagesByChannel(store.activeChannel.id);
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