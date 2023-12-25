
<template>
	<div class="chat">
		<ChatCard></ChatCard>
		<Modal v-if="store.isModalOpen">
			<Suspense>
				<NewChannelForm></NewChannelForm>
			</Suspense>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import ChatCard from './ChatCard.vue';
import Modal from './Modal.vue';
import NewChannelForm from './NewChannelForm.vue';
import { Suspense, inject } from 'vue';

const $data: any = inject('$data');
const store = $data.getStore();

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