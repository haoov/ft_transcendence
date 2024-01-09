
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

const $data: any = inject('$data');
const store = $data.getStore();

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

</style>