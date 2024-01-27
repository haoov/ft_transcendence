<template>
<div class="modal-leave-container">
	<div class="delete-div">
		<p>{{ message }}</p>
		<p>Are you sure you want to do it ?</p>
		<div class="div-btns">
			<button 
				type="button" 
				class="form-submit-btn"
				@click="leaveChannel(activeChannel.id)"
			>Yes</button>
			<button 
				type="button" 
				class="form-delete-btn"
				@click="cancelDelete()"
			>No</button>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';

const $data : any = inject('$data');
const store = $data.getStore();
const currentUser = await $data.getCurrentUser();
const activeChannel = computed(() => store.activeChannel);
const isCreator = computed(() => currentUser.id === activeChannel.value.creatorId);
const message = computed(() => {
	if (isCreator.value) {
		return `You are about to leave ${activeChannel.value.name}`;
	} else {
		return `Leaving ${activeChannel.value.name} will delete it for everyone`;
	}
});

const leaveChannel = (channelId: number) => {
	if (isCreator.value) {
		store.socket.emit('deleteChannel', channelId);
	} else {
		store.socket.emit('leaveChannel', {
			channelId,
			userId: currentUser.id,
		});
	}
	$data.closeConfirmationLeavingModal();
};

const cancelDelete = () => {
	$data.closeConfirmationLeavingModal();
};

</script>

<style scoped>

.modal-leave-container {
  width: 350px;
  background: linear-gradient(#212121, #212121) padding-box,
              linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
  border: 2px solid transparent;
  padding-top: 32px;
  padding-right: 24px;
  padding-bottom: 32px;
  padding-left: 28px;
  font-size: 14px;
  font-family: inherit;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  border-radius: 16px;
  background-size: 200% 100%;
  animation: gradient 10s ease infinite;
}

.delete-div .form-submit-btn,
.delete-div .form-delete-btn {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  align-self: flex-start;
  font-family: inherit;
  color: #717171;
  font-weight: 600;
  width: 40%;
  background: #313131;
  border: 1px solid #414141;
  padding: 12px 16px;
  font-size: inherit;
  gap: 8px;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 6px;
}

.div-btns {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}

.delete-div .form-submit-btn:hover,
.delete-div .form-delete-btn:hover {
  background-color: #fff;
  border-color: #fff;
}

</style>