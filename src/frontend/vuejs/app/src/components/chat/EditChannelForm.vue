<template>
<div class="modal-channel-form-container">
	<div class="edit-channel-form-container">
		<form class="form" @submit.prevent="submitForm">
			<div class="form-group">
				<label for="channelName">Channel Name :</label>
				<p v-if="nameError" style="color: red;">Name missing</p>
				<input 
					v-model="channelName"
					name="channelName"
					id="channelName"
					type="text"
					autocomplete="off"
					:class="{ 'is-invalid': nameError }"
					placeholder="Channel Name"
				>
				<svg v-if="channelName" class="cancel-icon" alt="Cancel Icon" @click=resetChannelName() width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g id="SVGRepo_bgCarrier" stroke-width="0"/>
					<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
					<g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#adadad"/> </g>
				</svg>
				</div>
				<div class="form-group">
					<label for="channelMode">Channel Mode :</label>
					<div class="radio-inputs" id="channelMode">
						<label
						class="radio"
						v-for="option in options"
						>
						<input
						autocomplete="off"
						type="radio"
						v-model="selectedOption"
						:value="option"
						name="channelMode"
						>
						<span class="name">{{ option }}</span>
					</label>
				</div>
				<div v-if="selectedOption === 'Protected'">
					<label for="password">Password :</label>
					<p v-if="passwordError" style="color: red;">Password missing</p>
					<input 
					v-model="password"
					name="password"
					id="password"
					type="password"
					placeholder="Password"
					autocomplete="off"
					:class="{ 'is-invalid': passwordError }"
					>
				</div>
			</div>
			<div class="div-btns">
				<button 
					type="submit" 
					class="form-submit-btn"
					:disabled="isSubmitDisabled"
				>Submit</button>
				<button 
					type="button" 
					class="form-delete-btn"
					@click="OpenDeleteConfirmation"
				>Delete</button>
			</div>
		</form>
	</div>
	<Modal v-if="toggleDeleteConfirmation" :function="closeDeleteConfirmation">
		<div class="delete-div">
			<p>Are you sure you want to delete this channel ?</p>
			<div class="div-btns">
				<button 
					type="button" 
					class="form-submit-btn"
					@click="deleteChannel"
				>Delete</button>
				<button 
					type="button" 
					class="form-delete-btn"
					@click="cancelDelete"
				>Cancel</button>
			</div>
		</div>
	</Modal>
</div>
</template>

<script setup lang="ts">

import SeachBar from './SearchBar.vue';
import Modal from './Modal.vue';
import { ref, computed, inject } from 'vue';

const $data : any = inject('$data');
const store = $data.getStore();
const activeChannel = computed(() => store.activeChannel);
const channelName = ref(activeChannel.value.name);
const selectedOption = ref(activeChannel.value.mode);
const password = ref('');
const nameError = ref(false);
const passwordError = ref(false);
const options = ['Public', 'Protected', 'Secret'];
const userIds = ref([]);
const isSubmitDisabled = computed(() => {
	if (selectedOption.value === 'Protected') {
		return !channelName.value || !password.value;
	}
	return !channelName.value;
});
const toggleDeleteConfirmation = ref(false);

const resetChannelName = () => {
	channelName.value = '';
};

const submitForm = () => {
	store.socket.emit('updateChannel', {
		channelId: activeChannel.value.id,
		name: channelName.value,
		mode: selectedOption.value,
		password: password.value,
		userIds: userIds.value,
	});
	activeChannel.value.name = channelName.value;
	$data.closeEditModalForm();
};

const OpenDeleteConfirmation = () => {
	toggleDeleteConfirmation.value = true;
};

const closeDeleteConfirmation = () => {
	toggleDeleteConfirmation.value = false;
};

const deleteChannel = () => {
	store.socket.emit('deleteChannel', activeChannel.value.id);
	toggleDeleteConfirmation.value = false;
	$data.closeEditModalForm();
};

const cancelDelete = () => {
	toggleDeleteConfirmation.value = false;
};

</script>

<style scoped>

.modal-channel-form-container {
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

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.edit-channel-form-container {
  width: 100%;
  height: 100%;
}

.edit-channel-form-container button:not(:disabled):active {
  scale: 0.95;
}

.edit-channel-form-container .form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.edit-channel-form-container .form-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.edit-channel-form-container .form-group label {
  display: block;
  margin-bottom: 5px;
  color: #717171;
  font-weight: 600;
  font-size: 12px;
}

.edit-channel-form-container .form-group input {
  width: 80%;
  padding: 3% 7%;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  background-color: transparent;
  border: 1px solid #414141;
}

.edit-channel-form-container .form-group input::placeholder {
  opacity: 0.5;
}

.edit-channel-form-container .form-group input:focus {
  outline: none;
  border-color: #e81cff;
}

.edit-channel-form-container .form-submit-btn,
.edit-channel-form-container .form-delete-btn,
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

.edit-channel-form-container .form-submit-btn:not(:disabled):hover {
  background-color: #fff;
  border-color: #fff;
}
.delete-div .form-submit-btn:hover,
.delete-div .form-delete-btn:hover {
  background-color: #fff;
  border-color: #fff;
}

.edit-channel-form-container .form-delete-btn:hover {
  color: white;
  background-color: #c91111;
  border-color: #c91111;
}
.radio-inputs {
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.5rem;
  background-color: linear-gradient(#212121, #212121) padding-box;
  box-sizing: border-box;
  box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
  padding: 0.25rem;
  width: 100%;
  font-size: 14px;
}

.radio-inputs .radio {
  flex: 1 1 auto;
  text-align: center;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: none;
  padding: .5rem 0;
  color: #717171;
  transition: all .15s ease-in-out;
}

.radio-inputs .radio input:checked + .name {
  background-color: #fff;
  font-weight: 600;
}

.is-invalid {
  border-color: #ff0000;
}

.cancel-icon {
    position: absolute;
    right: 50px;
    top: 64px;
    cursor: pointer;
}

.delete-div {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px solid #414141;
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

}

</style>
