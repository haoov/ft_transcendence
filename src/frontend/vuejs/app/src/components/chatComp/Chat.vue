
<template>
	<div class="chat">
		<ChatCard></ChatCard>
	</div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client';
import ChatCard from './ChatCard.vue';

const socket = io('http://localhost:3000');

</script>

<style scoped>
.chat {
  background: linear-gradient(
				to right,
				var(--c-black),
				var(--c-blue-dark),
				var(--c-black)
				);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff;
  overflow: hidden;
}
</style>