<template>
	<div class="Messages-div" ref="divRef">
		<ul v-for="(message, index) in messages">
			<Message
				:data="message"
				:index="index"
			></Message>
		</ul>
	</div>
</template>

<script setup lang="ts">

	import Message from './Message.vue';
	import { onUpdated, ref } from 'vue';
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
	}

	let currentSender : string = "";
	const data : any = inject('$data');
	const messages = ref<Message[]>([]);
	const socket: Socket = data.getSocket();

	//Probleme pour ajouter le message a la suite du precedent
	socket.on("newMessage", (data: any) => {
		if (currentSender == data.sender.name) {
			messages.value[messages.value.length - 1].message.text += "\n" + data.message.text;
			data = messages.value.pop() as Message;
		} else {
			currentSender = data.sender.name;
		}
		messages.value.push(data);
	});

</script>

<style scoped>

.Messages-div {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: auto;
}

p {
  color: black;
}
</style>