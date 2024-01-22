<template>
	<div class="Messages-div" :key="componentKey" >
		<ul
			v-for="(message, index) in messages"
			:id="index === messages.length - 1 ? 'last' : ''"
		>
			<Message
				:id="index"
				:data="message"
				:key="message.id"
				:currentUser="currentUser"
			></Message>
		</ul>
	</div>
</template>

<script setup lang="ts">
import Message from './Message.vue';
import { onUpdated, onMounted, computed, watch} from 'vue';
import { inject, ref } from 'vue';
import { Socket } from 'socket.io-client';
import type { User } from '@/utils';

type Message = {
	sender: User;
	message: {
		text: string;
		time: string;
	};
};

function scrollToBottomOnMounted() {
	const end = document.getElementById('last');
	end?.scrollIntoView();
};

function scrollToBottomSmooth() {
	const end = document.getElementById('last');
	end?.scrollIntoView({ behavior: 'smooth' });
};

const $data : any = inject('$data');
const currentUser : any = $data.getCurrentUser();
const store = $data.getStore();
const socket: Socket = store.socket;
const componentKey = ref(0);
const activeChannel = computed(() => store.activeChannel);
const messages = computed(() => store.messages);

watch(activeChannel, () => {
	if (activeChannel) {
		$data.loadMessagesByChannel(activeChannel.value.id);
		componentKey.value++;
		return;
	}
	store.messages = [];
	return;
});

onMounted(() => {
	scrollToBottomOnMounted();
});

onUpdated(() => {
	scrollToBottomSmooth();
});

socket.on("newMessage", async (message : any) => {
	const blockedUsers = await $data.getBlockedUsers();
	if (activeChannel.value.id !== message.message.channelId) {
		return;
	}
	if (!blockedUsers.some((blockedUser : any) => blockedUser.id === message.sender.id)) {
		store.messages.push(message);
	}
});

</script>

<style scoped>

.Messages-div {
  display: flex;
  flex-direction: column;
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