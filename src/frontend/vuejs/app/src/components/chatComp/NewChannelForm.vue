<template>
	<div class="new-channel-form-container">
		<form class="form" @submit.prevent="submitForm">
			<div class="form-group">
				<label for="channelName">Channel Name :</label>
				<p v-if="nameError" style="color: red;">Name missing</p>
				<div class="input-container">
					<input 
						v-model="channelName"
						name="channelName"
						id="channelName"
						type="text"
						autocomplete="off"
						:class="{ 'is-invalid': nameError }"
						placeholder="Channel Name"
					>
					<svg v-if="channelName" class="cancel-icon" alt="Cancel Icon" @click=resetchannelName width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" stroke-width="0"/>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
						<g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#adadad"/> </g>
					</svg>
				</div>
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
				<SeachBar :userIds="userIds"></SeachBar>
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
			<button 
				type="submit" 
				class="form-submit-btn"
				:disabled="isSubmitDisabled"
			>Submit</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import SeachBar from './SearchBar.vue';
import { ref, computed, inject } from 'vue';

const selectedOption = ref('Public');
const options = ['Public', 'Protected', 'Secret'];
const $data : any = inject('$data');
const store = $data.getStore();
const socket = store.socket;
const currentUser = await $data.getCurrentUser();
const channelName = ref('');
const password = ref('');
const nameError = ref(false);
const passwordError = ref(false);
const userIds = ref<number[]>([]);

const isSubmitDisabled = computed(() => {
  return !channelName.value || nameError.value || passwordError.value;
});

const submitForm = () => {
	userIds.value.push(currentUser.id);
	if (!channelName.value) {
		nameError.value = true;
		return;
	}
	if (selectedOption.value === 'Protected' && !password.value) {
		passwordError.value = true;
		return;
	}
	const newChannel = {
		name: channelName.value,
		mode: selectedOption.value,
		creatorId: currentUser.id,
		password: password.value,
		users: userIds.value,
	};
	nameError.value = false;
	passwordError.value = false;
	$data.closeModalForm();
	socket.emit('createNewChannel', newChannel);
};

const resetchannelName = () => {
	channelName.value = '';
};

</script>

<style scoped>

.new-channel-form-container {
  width: 100%;
  height: 100%;
}

.new-channel-form-container button:not(:disabled):active {
  scale: 0.95;
}

.new-channel-form-container .form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.new-channel-form-container .form-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.new-channel-form-container .form-group label {
  display: block;
  margin-bottom: 5px;
  color: #717171;
  font-weight: 600;
  font-size: 12px;
}

.new-channel-form-container .form-group input {
  width: 100%;
  padding: 3% 7%;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  background-color: transparent;
  border: 1px solid #414141;
}

.new-channel-form-container .form-group input::placeholder {
  opacity: 0.5;
}

.new-channel-form-container .form-group input:focus {
  outline: none;
  border-color: #e81cff;
}

.new-channel-form-container .form-submit-btn {
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

.new-channel-form-container .form-submit-btn:not(:disabled):hover {
  background-color: #fff;
  border-color: #fff;
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
  right: 7px;
  top: 10px;
  cursor: pointer;
}

.input-container {
  position: relative;
}

</style>