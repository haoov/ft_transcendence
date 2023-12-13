<template>
	<div class="Messages-div">
		<!-- <li v-for="(message, index) in messages">
			<Message :value="message"></Message>	
		</li> -->
	</div>
</template>

<script setup lang="ts">
	import axios from 'axios';
	import Message from './Message.vue';
	import { ref } from 'vue';

	// const messages = ref<any[]>([]);
	// const socket = defineProps(['socket']).socket;
	// socket.on("newMessage", (message: any) => {
	// 	messages.value.push(message);
	// });

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