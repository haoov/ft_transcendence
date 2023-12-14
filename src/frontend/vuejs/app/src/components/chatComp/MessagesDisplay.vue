<template>
	<div class="Messages-div">
		<li v-for="(message, index) in messages">
			<Message :message="message" :index="index"></Message>	
		</li>
	</div>
</template>

<script setup lang="ts">
	import axios from 'axios';
	import Message from './Message.vue';
	import { ref } from 'vue';
	import { inject } from 'vue';
	import { Socket } from 'socket.io-client';

	const data : any = inject('$data');
	const messages = ref<any[]>([]);
	const socket: Socket = data.getSocket();
	socket.on("newMessage", (message: any) => {
		messages.value.push(message);
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