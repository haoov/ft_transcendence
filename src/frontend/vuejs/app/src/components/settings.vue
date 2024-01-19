<template>
	<div class="l-wrapper">
		<div class="l-grid">
			<div class ="u-justify--center u-display--flex">
				<div class="c-avatar-container" @click="uploadFile">
					<img class="c-avatar" :src="avatarSrc"/>
					<form enctype="multipart/form-data" class="uploadPicture">
						<input
							id="file"
							type="file"
							@change="selectFile"
							ref="fileInput"
							accept="image/*" />
					</form>
				</div>
			</div>
				<div class="formTitle">Username</div>
			<div class="formField">
				<input 
				v-model="usernameSet"
				name="username"
				id="searchUser"
				type="text"
				autocomplete="off"
				>
			</div>
				<div class="formTitle">Email</div>
			<div class="formField">
				<div class="forbidden">{{ me.email }}</div>
			</div>
		
			<div class ="u-justify--center u-display--flex">
				<button id="saveButton" :disabled="disableSave" @click="updateProfile()">Save</button>
			</div>
		</div>		
	</div>
</template>

<script setup lang="ts">

import axios from "axios";
import type { User } from "@/utils";
import { computed, onMounted, ref } from "vue";
import { toast, type ToastType } from 'vue3-toastify';
import "vue3-toastify/dist/index.css"

const me = ref<User>({
	id: 0,
	username: "",
	avatar: "",
	email: "",
	status: "",
	games_won: [],
	games_lost: []
});
const usernameSet = ref<string>("");
const avatarSet = ref<File | null>(null);
const avatarSrc = computed(() => {
	const timestamp = Date.now();
	if (avatarSet.value)
		return URL.createObjectURL(avatarSet.value);
	else if (me.value.avatar.includes(':3000/api/user/avatar/'))
		return `${me.value.avatar}?${timestamp}`;
	else
		return me.value.avatar;
});
const fileInput = ref<HTMLElement | null>(null);
const disableSave = computed(() => {
	return (!usernameSet.value || usernameSet.value === me.value.username) && (!avatarSet.value);
});

// FETCHING DATA
async function fetchMe() {
	await axios
		.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`)
		.then( (data) => { 
			me.value = data.data;
			usernameSet.value = data.data.username;
		});
}


// UTIL FUNCTIONS
function updateProfile() {
	if (usernameSet.value && usernameSet.value !== me.value.username) {
		updateUsername();
	}
	if (avatarSet.value) {
		updateAvatar();
	}
}

function	updateUsername() {
	axios
		.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/update/username`, {
			username: usernameSet.value
		})
		.then( (data) => { 
			me.value = data.data;
			usernameSet.value = data.data.username;
		 sendToast("success", "Username has been updated!");
		})
		.catch( (err) => {
			if (err.response.status == 409) {
				sendToast("error", "Username is already in use!");
			}
		});
}

function	updateAvatar() {
	const formData = new FormData();
	formData.append('avatar', avatarSet.value as Blob);
	axios
		.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/update/avatar`, formData)
		.then( async (data) => { 
			avatarSet.value = null;
			me.value.avatar = data.data.avatar;
			sendToast("success", "Avatar has been updated!");
		})
		.catch( (err) => {
			avatarSet.value = null;
			sendToast("error", "Invalid format avatar!");
		});
}

function uploadFile() {
	if (fileInput.value) {
		fileInput.value.click();
	}
};

function selectFile(event: Event) {
	const inputEvent = event as InputEvent;
	const target = inputEvent.target as HTMLInputElement;
	avatarSet.value = target.files ? target.files[0] : null;
};

function sendToast(type: ToastType, message: string) {
	toast(message, {
		"theme": "dark",
		"type": type,
		"position": "bottom-center",
		"hideProgressBar": true,
		"transition": "slide",
		"dangerouslyHTMLString": true,
	})
}

onMounted(async () => {
	await fetchMe();
});

</script>

<style scoped>

.l-wrapper {
	width: 100%;
	max-width: 400px;
	height: 500px;
	margin: auto;
	padding: 1.6rem 1.6rem 3.2rem;
}

.l-grid {
	border-radius: 0.8rem;
	background: var(--c-surface);
	width: 100%;
	height: 450px;
	margin-bottom: 1.6rem;
	box-shadow: 0px 0px 0px 1px var(--c-black-light);
	box-sizing: border-box;
	padding: 1.6rem;
}


.formTitle {
	margin-left: 6rem;
	font-family: Overpass;
	font-size: 1.4rem;
	margin-top: 2rem;
}

.formField {
		justify-content: left;
		display: flex;
}

.formField input {
		width: 60%;
		height: 1.3rem;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		color: #fff;
		font-family: inherit;
		background-color: var(--c-black-light);
		border: 1px solid var(--c-black-light);
		font-family: Overpass;
		margin-left: 6rem;
		margin-top: 0.5rem;
		margin-bottom: 1.2rem;
}
.formField .forbidden {
		width: 60%;
		font-size: small;
		height: 1.3rem;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		color: var(--c-grey);
		font-family: Overpass;
		background-color: var(--c-black-light);
		border: 1px solid var(--c-black-light);
		font-family: Overpass;
		margin-left: 6rem;
		margin-top: 0.5rem;
		margin-bottom: 1.2rem;
		overflow: hidden;
		cursor: not-allowed;
}

.formField input::placeholder {
	opacity: 0.5;
}

.formField input:focus {
	outline: none;
	border-color: #e81cff;
}

#saveButton {
		font-size: small;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		color: #fff;
		background-color: var(--c-pink);
		border: 1px solid var(--c-pink);
		font-family: Overpass;
		margin-top: 3.5rem;
		margin-bottom: 1.2rem;
		overflow: hidden;
		transition: transform 0.1s ease-in-out;
}

#saveButton:active {
	transform: scale(0.95);
}

#saveButton:disabled {
	background-color: var(--c-grey);
	border: var(--c-grey);
	cursor: not-allowed;
	transform: none !important;
}

.c-avatar-container {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 10rem;
	height: 10rem;
	box-shadow: 0 0 3px, 0 0 5px var(--c-black-light), 0 0 7px var(--c-black-light), 0 0 10px var(--c-black-light);
	border-radius: 50%;
	background: var(--lightest);
	color: var(--dark);
	margin-top: 3rem;
	margin-bottom: 1.5rem;
}

.c-avatar {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
}

.c-avatar-container:hover .image {
	filter: brightness(70%);
}

.c-avatar-container::before {
	content: url('../assets/images/camera-30.png');
	position: absolute;
	background-color: rgba(211, 211, 211, 0.5);
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	display: none;
}
.c-avatar-container:hover::before {
	display: flex;
	align-items: center;
	justify-content: center;
}

.uploadPicture {
	display: none;
}


.u-display--flex {
	display: flex;
}
.u-justify--center {
	justify-content: center;
}

</style>
