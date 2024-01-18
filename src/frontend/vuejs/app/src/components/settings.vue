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
  return avatarSet.value ? URL.createObjectURL(avatarSet.value) : `${me.value.avatar}?${timestamp}`;
});
const disableSave = computed(() => {
  return (!usernameSet.value || usernameSet.value === me.value.username) && (!avatarSet.value);
});
let fileInput = ref<HTMLElement | null>(null);

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

function  updateUsername() {
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
      console.log(err.response.status);
      if (err.response.status == 409) {
        sendToast("error", "Username is already in use!");
      }
    });
}

function  updateAvatar() {
  const formData = new FormData();
  formData.append('avatar', avatarSet.value as Blob);
  axios
    .put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/update/avatar`, formData)
    .then( async (data) => { 
      avatarSet.value = null;
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

<style scoped>

h1,h2,h3,h4,h5,h6 {
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
  color: inherit;
  letter-spacing: 4px;
}

a {
  color: var(--c-teal);
  text-decoration: none;
  transition: all 120ms ease-out 0s;
  display: inline-block;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  font-family: Overpass;
}
a:hover {
  background: var(--c-teal-dark);
  color: var(--c-teal);
  box-shadow: 0px 0px 0px 0.4rem var(--c-teal-dark);
}

button, textarea, input, select {
  font-family: inherit;
  color: inherit;
}
button:active, button:focus, textarea:active, textarea:focus, input:active, input:focus, select:active, select:focus {
  outline: 0;
}

button, select {
  cursor: pointer;
}

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

.c-button {
  display: inline-block;
  background: var(--dark);
  border: 0;
  border-radius: 0.4rem;
  padding: 1.2rem 2rem;
  transition: all 120ms ease-out 0s;
}
.c-button--block {
  display: block;
  width: 100%;
}
.c-button:hover, .c-button:focus {
  filter: brightness(0.9);
}
.c-button:focus {
  box-shadow: 0px 0px 0px 0.4rem var(--primary-trans);
}
.c-button:active {
  box-shadow: 0px 0px 0px 0.4rem var(--primary-trans), inset 0px 0px 0.8rem rgba(0, 0, 0, 0.2);
  filter: brightness(0.8);
}

.c-select {
  background: transparent;
  padding: 1.2rem;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  font-size: 1.4rem;
  border-color: rgba(255, 255, 255, 0.2);
  transition: all 120ms ease-out 0s;
}
.c-select:hover {
  background: var(--darkest);
}



.c-button--transparent {
  background: transparent;
}


.c-button--light-gradient {
  background: linear-gradient(to top, var(--light), var(--lightest));
}

.u-text--oswald {
  font-family: "Oswald";
}

.u-text--overpass {
  font-family: Overpass, system-ui;
}

.u-text--italic {
  font-style: italic;
}

.u-text--left {
  text-align: left;
}
.u-text--center {
  text-align: center;
}
.u-text--right {
  text-align: right;
}

.u-text--grey {
  color: var(--c-grey) !important;
}

.u-bg--transparent {
  background: transparent !important;
}

.u-text--dark {
  color: var(--c-black-light);
  
}


.u-text--medium {
  font-size: 2rem;
  color: var(--medium) !important;
}

.u-bg--pink1 {
  background: var(--c-pink) !important;
}

.u-bg--pink3 {
  background: var(--c-pink-3) !important;
}

.u-bg--pink2 {
  background: var(--c-pink-2) !important;
}

.u-text--c-teal {
  color: var(--c-teal) !important;
}

.u-bg--light-gradient {
  background: linear-gradient(to top, var(--light), var(--lightest)) !important;
}

.u-text--light-gradient {
  color: linear-gradient(to top, var(--light), var(--lightest)) !important;
}

.u-display--flex {
  display: flex;
}

.u-align--center {
  align-items: center;
}

.u-justify--center {
  justify-content: center;
}

.u-align--flex-end {
  align-items: flex-end;
}

.u-justify--flex-end {
  justify-content: flex-end;
}

.u-align--flex-start {
  align-items: flex-start;
}

.u-justify--flex-start {
  justify-content: flex-start;
}

.u-align--space-between {
  align-items: space-between;
}

.u-justify--space-between {
  justify-content: space-between;
}

.u-text--small {
  font-size: 1.4rem;
}

.u-text--extra-small {
  font-size: 1.2rem;
}
.u-text--mini {
  font-size: 1.1rem;
}

.u-p--24 {
  padding-left: 2.4rem;
  padding-right: 2.4rem;
  padding-top: 2.4rem;
}

.u-pl--2 {
  padding-left: 0.2rem;
}

.u-ml--2 {
  margin-left: 0.2rem;
}

.u-pr--2 {
  padding-right: 0.2rem;
}

.u-mr--2 {
  margin-right: 0.2rem;
}

.u-pb--2 {
  padding-bottom: 0.2rem;
}

.u-mb--2 {
  margin-bottom: 0.2rem;
}

.u-pt--2 {
  padding-top: 0.2rem;
}

.u-mt--2 {
  margin-top: 0.2rem;
}

.u-pl--4 {
  padding-left: 0.4rem;
}

.u-ml--4 {
  margin-left: 0.4rem;
}

.u-pr--4 {
  padding-right: 0.4rem;
}

.u-mr--4 {
  margin-right: 0.4rem;
}

.u-pb--4 {
  padding-bottom: 0.4rem;
}

.u-mb--4 {
  margin-bottom: 0.4rem;
}

.u-pt--4 {
  padding-top: 0.4rem;
}

.u-mt--4 {
  margin-top: 0.4rem;
}

.u-pl--8 {
  padding-left: 0.8rem;
}

.u-ml--8 {
  margin-left: 0.8rem;
}

.u-pr--8 {
  padding-right: 0.8rem;
}

.u-mr--8 {
  margin-right: 0.8rem;
}

.u-pb--8 {
  padding-bottom: 0.8rem;
}

.u-mb--8 {
  margin-bottom: 0.8rem;
}

.u-pt--8 {
  padding-top: 0.8rem;
}

.u-mt--8 {
  margin-top: 0.8rem;
}

.u-pl--16 {
  padding-left: 1.6rem;
}

.u-ml--16 {
  margin-left: 1.6rem;
}

.u-pr--16 {
  padding-right: 1.6rem;
}

.u-mr--16 {
  margin-right: 1.6rem;
}

.u-pb--16 {
  padding-bottom: 1.6rem;
}

.u-mb--16 {
  margin-bottom: 1.6rem;
}

.u-pt--16 {
  padding-top: 1.6rem;
}

.u-mt--16 {
  margin-top: 1.6rem;
}

.u-pl--24 {
  padding-left: 2.4rem;
}

.u-ml--24 {
  margin-left: 2.4rem;
}

.u-pr--24 {
  padding-right: 2.4rem;
}

.u-mr--24 {
  margin-right: 2.4rem;
}

.u-pb--24 {
  padding-bottom: 2.4rem;
}

.u-mb--24 {
  margin-bottom: 2.4rem;
}

.u-pt--24 {
  padding-top: 2.4rem;
}

.u-mt--24 {
  margin-top: 2.4rem;
}

.u-pl--32 {
  padding-left: 3.2rem;
}

.u-ml--32 {
  margin-left: 3.2rem;
}

.u-pr--32 {
  padding-right: 3.2rem;
}

.u-mr--32 {
  margin-right: 3.2rem;
}

.u-pb--32 {
  padding-bottom: 3.2rem;
}

.u-mb--32 {
  margin-bottom: 3.2rem;
}

.u-pt--32 {
  padding-top: 3.2rem;
}

.u-mt--32 {
  margin-top: 3.2rem;
}

</style>
