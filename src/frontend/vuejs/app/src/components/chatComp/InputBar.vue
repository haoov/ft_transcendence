<template>
	<div class="input-bar-div">
		<form class="form-message" @submit.prevent="sendMessage">
			<input 
				type="text"
				autocomplete="off"
				name="text"
				class="input"
				placeholder="messages"
				v-model="input"
			>
		</form>
	</div>
</template>

<script setup lang="ts">
import { Socket, io } from "socket.io-client";
import { ref, inject } from "vue";

type Message = {
	senderId: number;
	channelId: number;
	text: string;
	datestamp: string;
	timestamp: string;
};

const input = ref<string>("");
const $data : any = inject('$data');
const socket : Socket = $data.getSocket();
const myUser = await $data.getCurrentUser();
const DateRawStamp : string = new Date().toISOString();
const props = defineProps({
	activeChannel: {
		type: Object,
	},
});
const activeChannel = props.activeChannel;

const sendMessage = () => {
	const newMessage: Message = {
		senderId: myUser.id,
		channelId: activeChannel?.id as number,
		text: input.value,
		datestamp: DateRawStamp.substring(0, 10),
		timestamp: DateRawStamp.substring(12, 19)
	};
	input.value = "";
	socket.emit("newMessage", newMessage);
};

</script>

<style scoped>
.input-bar-div {
  display: flex;
  justify-content: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Form and paragraph styles */
.form-message {
  display: flex;
  justify-content: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.input {
  color: white;
  border: none;
  outline: none;
  padding: 1.25em;
  background-color: transparent;
  transition: 300ms ease-in-out;
  width: 100%;
  height: auto;
}

.input:focus {
  color : black;
  background-color: white;
  transform: scale(1.05);
  box-shadow: 13px 13px 100px #969696, -13px -13px 100px #ffffff;
}

</style>