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
	userId: string;
	userEmail: String;
	channelId: Number;
	messageText: String;
	datestamp: String;
	timestamp: String;
};

const input = ref<string>("");
const $data : any = inject('$data');
const socket : Socket = $data.getSocket();
const myUser = await $data.getMyUser();
const DateRawStamp : string = new Date().toISOString();

const sendMessage = () => {
	const message: Message = {
		userId: myUser.id,
		userEmail: myUser.email,
		channelId: 1,
		messageText: input.value,
		datestamp: DateRawStamp.substring(0, 10),
		timestamp: DateRawStamp.substring(12, 19)
	};
	input.value = "";
	socket.emit("newMessage", message);
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
  border: none;
  outline: none;
  padding: 1.25em;
  background-color: #ccc;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.3);
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