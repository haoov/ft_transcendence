
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
		<Modal v-if="store.isAddUserModalOpen" :function="closeAddUserModalForm">
			<Suspense>
				<AddUserForm></AddUserForm>
			</Suspense>
		</Modal>
		<Modal v-if="store.isconfirmationLeavingModalOpen" :function="closeLeaveConfirmation">
			<Suspense>
				<ConfirmationLeaveChannel></ConfirmationLeaveChannel>
			</Suspense>
		</Modal>
		<Modal v-if="store.isProfileModalOpen" :function="closeProfilModal">
			<Suspense>
				<ProfilModal></ProfilModal>
			</Suspense>
		</Modal>
	</div>
</template>

<script setup lang="ts">

import ChatCard from './ChatCard.vue';
import Modal from './Modal.vue';
import ChannelModal from './ChannelModal.vue';
import EditChannelForm from './EditChannelForm.vue';
import AddUserForm from './AddUserForm.vue';
import ConfirmationLeaveChannel from './ConfirmationLeaveChannel.vue';
import ProfilModal from './ProfilModal.vue';
import { Suspense, inject, onMounted } from 'vue';
import { SocketManager } from '@/SocketManager';
import { ChatEvents } from '@/utils';

const $data: any = inject('$data');
const store = $data.getStore();
const socketManager: SocketManager = inject('socketManager') as SocketManager;

async function setInBackLastActiveChannel(id: string) {
	const user = await $data.getCurrentUser();
	$data.loadChannels(user.id);
	const channel = store.channels.find((channel : any) => channel.id === parseInt(id));
	if (channel) {
		$data.setActiveChannel(channel);
	} else {
		$data.setActiveChannel(null);
	}
}

onMounted(() => {
	if (!socketManager.hasEventListener("chat", ChatEvents.lastActiveChannel)) {
		socketManager.addEventListener("chat", ChatEvents.lastActiveChannel, setInBackLastActiveChannel);
	}
});

const closeModal = () => {
	$data.closeModalForm()
}

const closeEditModal = () => {
	$data.closeEditModalForm()
}

const closeAddUserModalForm = () => {
	$data.closeAddUserModalForm()
}

const closeLeaveConfirmation = () => {
	$data.closeConfirmationLeavingModal()
}

const closeProfilModal = () => {
	$data.closeProfileModal()
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