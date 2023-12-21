
<template>
	<div class="chat">
		<ChatCard></ChatCard>
		<Modal v-if="isModalOpen">
			<NewChannelForm></NewChannelForm>
		</Modal>
		<button @click="openModal">Open Modal</button>
		<button @click="closeModal">Close Modal</button>
	</div>
</template>

<script setup lang="ts">
import ChatCard from './ChatCard.vue';
import Modal from './Modal.vue';
import NewChannelForm from './NewChannelForm.vue';
import { ref } from 'vue';

let isModalOpen = ref(false);
function openModal() {
	console.log('openModal', isModalOpen);
	isModalOpen.value = true;
}

function closeModal() {
	console.log('closeModal', isModalOpen);
	isModalOpen.value = false;
}

</script>

<style scoped>
.chat {
	position: relative;
	background: linear-gradient(to right,
			var(--c-black),
			var(--c-blue-dark),
			var(--c-black));
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
}

p {
	color: white;
}
</style>