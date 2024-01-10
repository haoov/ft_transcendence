<template>
	<div class="join-channel-form-container">
		<form class="form" @submit.prevent="submitForm">
			<div class="form-group">
				<label for="searchChannel">Search :</label>
				<div class="input-container">
				<img class="search-icon" src="@/assets/images/chat-svg/search-alt-1-svgrepo-com.svg" alt="Search Icon">
					<input 
					v-model="search"
					name="searchChannel"
					id="searchChannel"
					type="text"
					autocomplete="off"
					placeholder="Search"
					>
					<img v-if="search" class="cancel-icon" src="@/assets/images/chat-svg/cross-svgrepo-com.svg" alt="Cancel Icon" @click=resetChannelToJoin>
				</div>
				<ul>
					<li
						v-for="result in searchResults"
						:key="result.name"
						@click="setSelectedResult(result)"
						id = "searchResult"
						:class="{'is-selected': result?.id === channelToJoin?.id }"
					>
						{{ result.name }}
						<span v-if="result.mode === 'Protected'"> <img src="@/assets/images/chat-svg/lock-svgrepo-com.svg" alt="Lock Icon"> #{{ result.id }}</span>
  						<span v-else>#{{ result.id }}</span>
					</li>
				</ul>
				<div v-if="channelToJoin?.mode === 'Protected'">
					<label for="password">Password :</label>
					<p v-if="passwordError" style="color: red;">{{ errorMessagePassword }}</p>
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
				class="form-join-btn"
				:disabled="isSubmitDisabled"
			>Join</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';

interface Channel {
  creatorId: string;
  id: string;
  name: string;
  mode: string;
  password: string;
}

const $data : any = inject('$data');
const socket = $data.getSocket();
const currentUser = await $data.getCurrentUser();
const channelList = await $data.getChannels();
const channelToJoin = ref<Channel>();
const password = ref('');
const passwordError = ref(false);
const errorMessagePassword = ref('');

const search = ref('');

const searchResults = computed(() => {
    if (channelToJoin.value) {
        return [channelToJoin.value];
    } else if (search.value.length === 0) {
        return [] as Channel [];
    } else {
        return channelList.filter((channel: Channel) => {
            return channel.name.toLowerCase().includes(search.value.toLowerCase());
        });
    }
});

const isSubmitDisabled = computed(() => {
  return !channelToJoin.value || 
	(channelToJoin?.value.mode === 'Protected' && !password) || 
	passwordError.value;
});

const setSelectedResult = (channel: Channel) => {
	channelToJoin.value = channel;
	search.value = channelToJoin.value.name;
}

const resetChannelToJoin = () => {
	channelToJoin.value = undefined;
	search.value = '';
}

const submitForm = () => {
	if (!channelToJoin.value) {
		return;
	}
	if (channelToJoin.value.mode === 'Protected' && password.value.length === 0) {
		passwordError.value = true;
		errorMessagePassword.value = 'Password is required';
		return;
	}
	socket.emit('joinChannel', {
		channelId: channelToJoin.value.id,
		password: password.value,
		userId: currentUser.id,
	});

};

socket.on('channelJoined', (ret : boolean) => {
	console.log(ret);
	if (ret) {
		$data.closeModalForm();
		passwordError.value = false;
	} else {
		passwordError.value = true;
		errorMessagePassword.value = 'Wrong password';
	}
});

</script>

<style scoped>

.join-channel-form-container {
  width: 100%;
  height: 100%;
}

.join-channel-form-container button:not(:disabled):active {
  scale: 0.95;
}

.join-channel-form-container .form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.join-channel-form-container .form-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.join-channel-form-container .form-group label {
  display: block;
  margin-bottom: 5px;
  color: #717171;
  font-weight: 600;
  font-size: 12px;
}

.join-channel-form-container .form-group input {
  width: 80%;
  padding: 3% 7%;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  background-color: transparent;
  border: 1px solid #414141;
}

.join-channel-form-container .form-group input::placeholder {
  opacity: 0.5;
}

.join-channel-form-container .form-group input:focus {
  outline: none;
  border-color: #e81cff;
}

.join-channel-form-container .form-join-btn {
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

.join-channel-form-container .form-join-btn:not(:disabled):hover {
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

ul {
  list-style: none;
  padding: 0;
  padding-right: 10px;
  margin: 0;
  width: 100%;
  max-height: 120px;
  overflow-y: auto;
}

ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 8px;
}

ul::-webkit-scrollbar-track {
  background-color: transparent;
}

ul::-webkit-scrollbar-thumb:hover,
ul::-webkit-scrollbar-thumb:active {
  background-color: #e81cff;
  box-shadow:0 0 6px #e81cff;
}

ul::-webkit-scrollbar-track:hover,
ul::-webkit-scrollbar-track:active {
  background-color: transparent;
}

#searchResult {
  display: flex;
  justify-content: space-between;
  list-style: none;
  width: 91%;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  background-color: #313131;
  color: #fff;
  margin: 5px 0;
}

#searchResult:hover {
  background-color: #fff;
  color: #313131;
}

.is-selected {
  border: solid 0.5px #e81cff;
}

span {
  color: #717171;
}

.input-container {
    position: relative;
}

.search-icon, .cancel-icon {
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
}

.search-icon {
    left: 7px;
}

.cancel-icon {
    right: 25px;
	cursor: pointer;
}
</style>