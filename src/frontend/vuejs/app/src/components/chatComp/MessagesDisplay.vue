<template>
	<div class="Messages-div" ref="">
		<ul 
			v-for="(message, index) in messages"
			:id="index == messages.length - 1 ? 'last' : ''"
		>
			<Message :data="message" :id="index"></Message>
		</ul>
	</div>
</template>

<script setup lang="ts">

	import Message from './Message.vue';
	import { onUpdated, onMounted, ref } from 'vue';
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

	const data : any = inject('$data');
	const usersList = await data.getUsers();
	const messagesRaw = await data.getRawMessages();
	
	function convertMessage(messagesRaw : any[]) : Message[] {
		let messages : Message[] = [];
		for (const messageRaw of messagesRaw) {
			let message : Message = {
				sender: {
					name: "",
					avatar: ""
				},
				message: {
					text: "",
					time: ""
				}
			};
			for (const user of usersList) {
				if (user.id == messageRaw.senderId) {
					message.sender.name = user.username;
					message.sender.avatar = user.avatar;
					break;
				}
			}
			message.message.text = messageRaw.text;
			message.message.time = messageRaw.timestamp;
			messages.push(message);
		};
		return messages;
	};
	const socket: Socket = data.getSocket();
	let messages = ref<Message[]>(convertMessage(messagesRaw));
	let currentSender : string = "";

	function scrollToBottomOnMounted() {
		const end = document.getElementById('last');
		end?.scrollIntoView();
	}

	function scrollToBottomSmooth() {
		const end = document.getElementById('last');
		end?.scrollIntoView({ behavior: 'smooth' });
	}
	
	onMounted(() => {
		scrollToBottomOnMounted();
	});

	onUpdated(() => {
		scrollToBottomSmooth();
	});

	socket.on("newMessage", (data: any) => {
		messages.value.push(data);
	});

</script>

<style scoped>

.Messages-div {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

ul {
  width: fit-content;
  height: fit-content;
}

p {
  color: black;
}
</style>