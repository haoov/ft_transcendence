<template>
<div class="modal-channel-form-container">
	<div class="new-channel-form-container">
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
			<div class="div-btns">
				<button 
					type="submit" 
					class="form-submit-btn"
					:disabled="isSubmitDisabled"
				>Submit</button>
				<button 
					type="button" 
					class="form-delete-btn"
					@click="deleteChannel"
				>Delete</button>
			</div>
		</form>
	</div>
</div>
</template>

<script setup lang="ts">

import SeachBar from './SearchBar.vue';
import { ref, computed, inject } from 'vue';

const $data : any = inject('$data');
const store = $data.getStore();
const activeChannel = computed(() => store.activeChannel);
const channelName = ref(activeChannel.value.name);
const selectedOption = ref(activeChannel.value.mode);
const password = ref('');
const nameError = ref(false);
const passwordError = ref(false);
const options = ['Public', 'Private', 'Protected', 'Secret'];
const userIds = ref([]);
const isSubmitDisabled = computed(() => {
	if (selectedOption.value === 'Protected') {
		return !channelName.value || !password.value;
	}
	return !channelName.value;
});

const submitForm = () => {
	console.log('edit channel');
}

const deleteChannel = () => {
	console.log('delete channel');
}
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

.new-channel-form-container .form-submit-btn,
.new-channel-form-container .form-delete-btn {
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

.new-channel-form-container .form-submit-btn:not(:disabled):hover {
  background-color: #fff;
  border-color: #fff;
}

.new-channel-form-container .form-delete-btn:hover {
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

</style>
