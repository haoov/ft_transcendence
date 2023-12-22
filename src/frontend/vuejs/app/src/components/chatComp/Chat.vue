
<template>
	<div class="chat">
		<ChatCard
			@update:Visibility="toggleModal"
		></ChatCard>
		<Modal
			v-if="isModalOpen"
			:Visibility="isModalOpen"
			@update:Visibility="toggleModal"
		>
			<Suspense>
				<NewChannelForm
					@update:Visibility="toggleModal"
				></NewChannelForm>
			</Suspense>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import ChatCard from './ChatCard.vue';
import Modal from './Modal.vue';
import NewChannelForm from './NewChannelForm.vue';
import { ref } from 'vue';

let isModalOpen = ref(false);

function toggleModal() {
	isModalOpen.value = !isModalOpen.value;
};

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