<template>
	<div class="Messages-div" ref="divRef">
		<ul v-for="(message, index) in messages">
			<Message :message="message" :index="index"></Message>	
		</ul>
	</div>
</template>

<script setup lang="ts">
	import Message from './Message.vue';
	import { onUpdated, ref } from 'vue';
	import { inject } from 'vue';
	import { Socket } from 'socket.io-client';

	const data : any = inject('$data');
	const messages = ref<any[]>([]);
	const socket: Socket = data.getSocket();
	socket.on("newMessage", (message: any) => {
		messages.value.push(message);
	});

	const divRef = ref(null);
	onUpdated(() => {
		if (divRef.value) {
			divRef.value.scrollTop = divRef.value.scrollHeight;
		}
		return {divRef}
	});
</script>

<style scoped>

.Messages-div {
  width: 100%;
  height: 100%;
  overflow:hidden;
}

p {
  color: black;
}
</style>