<template>
	<div class="handle-error">
		<p v-if="inputErrorLenght" style="color: red;">Message too long</p>
		<div :class="inputClass">
			<form class="form-message" @submit.prevent="sendMessage">
				<input 
				type="text"
				autocomplete="off"
				name="text"
				placeholder="messages"
				v-model="input"
				:disabled="!activeChannel"
				class="input"
				>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Socket } from "socket.io-client";
import { ref, inject, computed, watch } from "vue";

type Message = {
	senderId: number;
	channelId: number;
	text: string;
	datestamp: string;
};

const input = ref<string>("");
const $data : any = inject('$data');
const store = $data.getStore();
const myUser = await $data.getCurrentUser();
const socket : Socket = store.socket;
const $store = $data.getStore();
const activeChannel = computed(() => $store.activeChannel);

const inputClass = computed(() => {
	if (input.value.length > 1024) return "input-bar-div error";
	else return "input-bar-div";
});
const inputErrorLenght = computed(() => {
	if (input.value.length > 1024) return true;
	else return false;
});

const sendMessage = () => {
	if (input.value === "") return;
	else if (input.value.length > 1024) {
		return;
	}
	const DateRawStamp : string = new Date().toISOString();
	const newMessage: Message = {
		senderId: myUser.id,
		channelId: activeChannel.value.id,
		text: input.value,
		datestamp: DateRawStamp
	};
	input.value = "";
	socket.emit('newMessage', newMessage);
};

watch(activeChannel, () => {
	input.value = "";
});

</script>

<style scoped>
.handle-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
  overflow: hidden;
  border-radius: 0 0 0.8rem 0;
}

.input-bar-div {
  width: 100%;
  border-radius: 0 0 0.8rem 0;
  height: fit-content;
  overflow: hidden;
}

.form-message {
  width: 100%;
  height: fit-content;
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

.error {
  border: solid red 0.5px;
}

p {
  margin: 0;
  padding: 0;
  font-size: 0.8em;
}

.input:not(:disabled):focus {
  color : black;
  background-color: #cacaca;
  transform: scale(1.05);
  border-radius: 0 0 0 0.8rem;
}

</style>

