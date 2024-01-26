<template>
	<div class="Messages-div" >
		<ul
			v-for="(message, index) in messages.reverse()"
			:id="index === nbMessage - 1 ? 'last' : ''"
		>
			<V_Message
				:id="index"
				:data="message"
				:key="message.getId()"
				:currentUser="currentUser"
			></V_Message>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { type SocketManager } from "@/SocketManager";
import { ChatEvents, ServerEvents, type User} from '@/utils'
import chat from '@/components/chat/classes/chat';
import { Channel } from './classes/channel';
import { Message } from './classes/message';
import V_Message from './Message.vue';
import { onUpdated, onMounted, computed, watch} from 'vue';
import { inject, ref } from 'vue';

const socketManager: SocketManager = inject('socketManager') as SocketManager;
const $data : any = inject('$data');
const currentUser = socketManager.getUser();
const channel = computed(() => chat.getCurrentChannel());
const messages : Message [] = channel.value ? channel.value.getMessages() : [];
const nbMessage : number = messages.length;

onUpdated(() => {
		scrollToBottomSmooth();
});

function scrollToBottomSmooth() {
	const end = document.getElementById('last');
	end?.scrollIntoView({ behavior: 'smooth' });
};

// async function recievedMessage(data : any) {
	// 	const message : Message = new Message(
		// 		data.message.id,
		// 		data.sender,
		// 		data.message.text,
		// 		data.message.time
		// 		);
		// 	const blockedUsers = await $data.getBlockedUsers();
		// 	if (activeChannel.value?.getId() !== data.channelId) {
			// 		return;
			// 	}
			// 	if (!blockedUsers.some((blockedUser : any) => blockedUser.id === message.getSender().id)) {
				// 		store.messages.push(message);
				// 	}
				// };
				
				// onMounted(() => {
					// 	if(!socketManager.hasEventListener("chat", ChatEvents.receivedMessage)) {
// 		socketManager.addEventListener("chat", ChatEvents.receivedMessage, recievedMessage);
// 	}
// });

// socketManager.addEventListener("user", ServerEvents.dataChanged, async () => {
	// 	currentUser.value = await $data.getCurrentUser();
	// 	if (activeChannel.value) {
		// 		// $data.loadMessagesByChannel(activeChannel.value.getId());
		// 		activeChannel.value.loadMessages();
		// 	}
		// });
		
	// function scrollToBottomOnMounted() {
	// 	const end = document.getElementById('last');
	// 	end?.scrollIntoView();
	// };
		
	</script>

<style scoped>

.Messages-div {
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  height: auto;
  margin-top: 2px;
  overflow-x: hidden;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  margin: 0 0 5px 7px;
  padding: 0;
}

p {
  color: rgb(216, 216, 216);
}
</style>