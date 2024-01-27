<template>
	<div class="Messages-div" >
		<ul
			v-for="(message, index) in props.messages"
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
import { type SocketManager } from "@/SocketManager";
import { ChatEvents, ServerEvents, type User} from '@/utils'

type Message = {
	id: number,
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
const currentUser = ref<User>(await $data.getCurrentUser());
const props = defineProps<{channel: any, messages: Message []}>();

onMounted(() => {
	scrollToBottomOnMounted();
});

onUpdated(() => {
	scrollToBottomSmooth();
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