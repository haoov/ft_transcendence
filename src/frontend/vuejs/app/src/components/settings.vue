<template>
	<div class="l-wrapper">
		<div class="l-grid" :style="dynamicHeight">
			<div style="display: flex; width: 370px; position: absolute; justify-content: flex-end;">
				<img id="logout_button" @click="logout()" :src="logoutIcon" title="logout"/>
			</div>
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
				type="text"
				autocomplete="off"
				>
			</div>
			<div class="formTitle">Email</div>
			<div class="formField">
				<div class="forbidden">{{ me.email }}</div>
			</div>

			<div class="formTitle">2FA</div>
			<div class="radio-inputs" id="2fa">
				<label class="radio"
				v-for="option in options"
				>
				<input
				autocomplete="off"
				type="radio"
				:value="option"
				name="2fa"
				@click="getQRcode(option)"
				v-model="selectedOption"
				>
				<span class="name">{{ option }}</span>
				</label>
			</div>
			<img v-if="!me.twofa_enabled && selectedOption == 'Enabled'" id="qrCode" :src="qrCode">
			<div v-if="twoFaChangedToEnabled" class="codeTitle">Enter code:</div>
			<div v-if="twoFaChangedToEnabled" class="formField codeField">
				<input 
				v-model="twoFaCode"
				name="twoFaCode"
				type="text"
				autocomplete="off"
				>
			</div>
			<div class ="u-justify--center u-display--flex">
				<button id="saveButton" :disabled="disableSave" @click="updateProfile()">Save</button>
			</div>
			<div class="c-warning" v-if="(usernameSet.length > 15)">Username must be 15 characters or less.</div>
		</div>		
	</div>
</template>

<script setup lang="ts">

import axios from "axios";
import type { User } from "@/utils";
import { computed, onMounted, ref } from "vue";
import notify from "@/notify/notify";
import logoutIcon from "@/assets/images/logout.png";

// CSS
const dynamicHeight = computed(() => {
	if (twoFaChangedToEnabled.value)
		return "height: 720px";
	else
		return "height: 470px";
});
const disableSave = computed(() => {
	if ((twoFaChangedToEnabled.value && !twoFaCode.value))
		return true;
	else
		return ((!usernameSet.value || usernameSet.value == me.value.username || usernameSet.value.length > 15)
			&& !avatarSet.value)
			&& !twoFaChanged.value;
});

// DATA
const me = ref<User>(({
	id: 0,
	username: "",
	avatar: "",
	twofa_enabled: false,
	email: "",
	status: "",
	games_won: [],
	games_lost: []
}));

// Username
const usernameSet = ref<string>("");

// Avatar
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

// 2FA
const options = ['Disabled', 'Enabled'];
const selectedOption = ref("");
const twoFaChangedToEnabled = computed(() => {
	return (selectedOption.value == "Enabled" && !me.value.twofa_enabled);
});
const twoFaChanged = computed(() => {
	return twoFaChangedToEnabled.value
	|| (selectedOption.value == "Disabled" && me.value.twofa_enabled);
});
const twoFaCode = ref<string>("");
const qrCode = ref<string>("");

// FETCHING DATA
async function fetchMe() {
	await axios
		.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`)
		.then( (data) => { 
			me.value = data.data;
			usernameSet.value = data.data.username;
			selectedOption.value = me.value.twofa_enabled ? "Enabled" : "Disabled";
		});
}


// UTIL FUNCTIONS
function updateProfile() {
	if (usernameSet.value && usernameSet.value != me.value.username)
		updateUsername();
	if (avatarSet.value)
		updateAvatar();
	if (twoFaChangedToEnabled.value)
		update2FA("Enabled");
	else if (twoFaChanged.value)
		update2FA("Disabled");
}

async function	updateUsername() {
	await axios
		.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/update/username`, {
			username: usernameSet.value
		})
		.then( (data) => {
			me.value = data.data;
			usernameSet.value = data.data.username;
			notify.newNotification("success", {message: "Username has been updated!"})
		})
		.catch( (err) => {
			if (err.response.status == 409) {
				usernameSet.value = me.value.username;
				notify.newNotification("error", {message: "Username is already in use!"})
			}
		});
}

async function	updateAvatar() {
	const formData = new FormData();
	formData.append('avatar', avatarSet.value as Blob);
	await axios
		.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/update/avatar`, formData)
		.then( async (data) => { 
			avatarSet.value = null;
			me.value.avatar = data.data.avatar;
			notify.newNotification("success", {message: "Avatar has been updated!"})
		})
		.catch( (err) => {
			avatarSet.value = null;
			notify.newNotification("error", {message: "Invalid format avatar!"})
		});
}

async function	update2FA(to: string) {
	if (to == "Enabled") {
		await axios
			.post(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth/2fa/turn-on`, {
				twofaCode: twoFaCode.value,
			})
			.then( async () => { 
				me.value.twofa_enabled = true;
				twoFaCode.value = "";
				qrCode.value = "";
				notify.newNotification("success", {message: "2FA has been enabled!"})
			})
			.catch( (err) => {
				twoFaCode.value = "";
				qrCode.value = "";
				selectedOption.value = me.value.twofa_enabled ? "Enabled" : "Disabled";
				notify.newNotification("error", {message: "Invalid code!"})
			});
	}
	else if (to == "Disabled") {
		await axios
			.post(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth/2fa/turn-off`)
			.then( async () => { 
				me.value.twofa_enabled = false;
				twoFaCode.value = "";
				qrCode.value = "";
				notify.newNotification("success", {message: "2FA has been disabled!"})
			})
			.catch( (err) => {
				twoFaCode.value = "";
				qrCode.value = "";
				selectedOption.value = me.value.twofa_enabled ? "Enabled" : "Disabled";
				notify.newNotification("error", {message: "An error occured!"})
			});
	}
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

async function getQRcode(option: string) {
	selectedOption.value = option;
	if (selectedOption.value === "Enabled" && !me.value.twofa_enabled) {
		await axios
			.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth/2fa/generate`)
			.then( (data) => { 
				qrCode.value = data.data;
			})
			.catch( (err) => {
				notify.newNotification("error", {message: "An error occured!"})
				selectedOption.value = me.value.twofa_enabled ? "Enabled" : "Disabled";
			});
	}
}

function logout() {
	axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth/logout`)
		.then(() => {
			window.location.href = "/";
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
	max-height: 800px;
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


.formTitle {
	margin-left: 6rem;
	font-family: Overpass;
	font-size: 1.4rem;
	margin-top: 1rem;
}

.formField {
		justify-content: left;
		display: flex;
}

.formField input {
		width: 60%;
		border-radius: 0.5rem;
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
		border-radius: 0.5rem;
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

.radio-inputs {
	display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    box-sizing: border-box;
	background-color: var(--c-black-light);
    box-shadow: 0 0 0 1px #0000000f;
    padding: 0.25rem;
    font-size: small;
    width: 18.8rem;
    margin-left: 6rem;
	margin-top: 0.5rem;
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
  border-radius: 0.6rem;
  border: none;
  padding: .5rem 0;
  color: #717171;
  transition: all .15s ease-in-out;
}

.radio-inputs .radio input:checked + .name {
  background-color: #fff;
}


#qrCode {
	width: 16rem;
    height: 16rem;
    margin-left: 7rem;
    margin-top: 1.5rem;
}
.codeTitle {
	margin-left: 7rem;
	margin-top: 1rem;
	font-family: Overpass;
	font-size: 1.1rem;
}

.codeField input {
	width: 14rem;
	margin-left: 7rem;
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


.c-warning {
	display: flex;
	justify-content: center;
	font-family: Overpass;
	font-size: 1.1rem;
	font-style: italic;
}

.u-display--flex {
	display: flex;
}
.u-justify--center {
	justify-content: center;
}

#logout_button {
	height: 20px;
	width: 20px;
	cursor: pointer;
	transition: scale 0.1s ease-in-out;
}

#logout_button:hover {
	scale: 1.1;
}
</style>
