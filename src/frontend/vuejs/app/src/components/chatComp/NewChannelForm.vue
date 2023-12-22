<template>
	<div class="new-channel-form-container">
		<form class="form" @submit.prevent="submitForm">
			<div class="form-group">
				<label for="channelName">Channel Name</label>
				<input 
					v-model="channelName"
					name="channelName"
					id="channelName"
					type="text"
					autocomplete="off"
				>
			</div>
			<div class="form-group">
				<label for="channelMode">Channel Mode</label>
				<div class="radio-inputs" id="channelMode">
					<label
						class="radio"
						v-for="(option, index) in options"
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
import { ref, computed, inject } from 'vue';

let selectedOption = 'Public';
const options = ['Public', 'Private', 'Protected', 'Secret'];
const $data : any = inject('$data');
const socket = $data.getSocket();
const usersList = await $data.getUsers();
const currentUser = await $data.getCurrentUser();
const emit = defineEmits();
const channelName = ref('');
const channelNameError = ref(false);

const isSubmitDisabled = computed(() => {
  return !channelName.value || channelNameError.value;
});

const submitForm = () => {
	if (!channelName.value) {
		channelNameError.value = true;
		return;
	}
	const newChannel = {
		name: channelName.value,
		modeChannel: selectedOption,
		creatorId: currentUser.id,
	};
	console.log(newChannel);
	emit('update:Visibility', '');
	socket.emit('newChannel', newChannel);
}

</script>

<style scoped>

.new-channel-form-container {
  width: 300px;
  background: linear-gradient(#212121, #212121) padding-box,
              linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
  border: 2px solid transparent;
  padding: 32px 24px;
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
  width: 80%;
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
</style>