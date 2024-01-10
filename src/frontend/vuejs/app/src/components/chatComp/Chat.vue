
<template>
	<div class="chat">
		<ChatCard></ChatCard>
		<Modal v-if="store.isModalOpen" :function="closeModal">
			<Suspense>
				<ChannelModal></ChannelModal>
			</Suspense>
		</Modal>
		<Modal v-if="store.isEditModalOpen" :function="closeEditModal">
			<Suspense>
				<EditChannelForm></EditChannelForm>
			</Suspense>
		</Modal>
	</div>
</template>

<script setup lang="ts">

import ChatCard from './ChatCard.vue';
import Modal from './Modal.vue';
import ChannelModal from './ChannelModal.vue';
import EditChannelForm from './EditChannelForm.vue';
import { Suspense, inject } from 'vue';
import { io, Socket } from 'socket.io-client';
import { onBeforeRouteLeave } from 'vue-router';

const $data: any = inject('$data');
const store = $data.getStore();
$data.setSocket(io('http://localhost:3000/chat'));
const socket : Socket = store.socket; 
socket.on('NewConnection', async () => {
	const user = await $data.getCurrentUser();
	socket.emit('userConnected', user);
});

onBeforeRouteLeave(() => {
	socket.disconnect();
});

const closeModal = () => {
	$data.closeModalForm()
}

const closeEditModal = () => {
	$data.closeEditModalForm()
}

</script>

<style scoped>
.chat {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 90vh;
}

</style>