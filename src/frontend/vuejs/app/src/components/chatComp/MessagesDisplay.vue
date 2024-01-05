<template>
	<div class="Messages-div" ref="">
		<ul 
			v-for="(message, index) in messages"
			:id="index == messages.length - 1 ? 'last' : ''"
		>
			<Message :data="message" :id="index" :key="message.id"></Message>
		</ul>
	</div>
</template>

<script setup lang="ts">
import Message from './Message.vue';
import { onUpdated, onMounted, computed, watch} from 'vue';
import { inject } from 'vue';
import { Socket } from 'socket.io-client';

type Message = {
	sender: {
		name: string;
		avatar: string;
	};
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

const data : any = inject('$data');
const store = data.getStore();
const socket: Socket = data.getSocket();

const activeChannel = computed(() => store.activeChannel);
const messages = computed(() => store.messages);

watch(activeChannel, () => {
	if (activeChannel) {
		data.loadMessagesByChannel(activeChannel.value.id);
		return;
	}
	return [];
});

onMounted(() => {
	scrollToBottomOnMounted();
});

onUpdated(() => {
	scrollToBottomSmooth();
});

socket.on("newMessage", (message : any) => {
	store.messages.push(message);
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
  width: 100%;
  height: fit-content;
  padding: 0;
  margin: 0;
}

p {
  color: rgb(216, 216, 216);
}
</style>