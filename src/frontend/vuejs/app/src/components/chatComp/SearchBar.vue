<template>
	<div  class="form-group">
		<label for="channelUsers">Add Users</label>
		<p v-if="!userFound" style="color: red;">User not found</p>
		<p v-if="userAlreadyAdded" style="color: red;">User already added</p>
		<div class="input-container">
			<svg class="search-icon" width="10px" height="10px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#999494">
				<g id="SVGRepo_bgCarrier" stroke-width="0"/>
				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
				<g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#a3a3a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
			</svg>
			<input
				type="text"
				id="channelUsers"
				placeholder="Search users"
				autocomplete="off"
				spellcheck="false"
				v-model="inputVal"
				@keyup.enter="searchValue"
				@keydown.enter.prevent
				:class="{ 'is-invalid': inputVal.length > 0 && (!userFound || userAlreadyAdded)}"
				>
				<svg v-if="inputVal" class="cancel-icon" alt="Cancel Icon" @click=resetInputVal width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g id="SVGRepo_bgCarrier" stroke-width="0"/>
					<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
					<g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#adadad"/> </g>
				</svg>
		</div>
		<div>
			<ul>
				<li
					v-for="(user, index) in firstSixUsers"
					:key="index"
				>
					<p v-if="index < 5" @click="removeUserFromList(index)" >{{ user.username }}</p>
					<p v-else-if="index === 5">...</p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';

interface User {
	id : number,
	username: string,
	avatar: string;
	email: string,
};

function isAlreadyAdded(user : User) {
	for (const userToAdd of listUsersToAdd.value) {
		if (userToAdd.username === user.username) {
			return true;
		}
	}
	return false;
}

const props = defineProps ({
	userIds: {
		type: Array,
	},
});

const $data : any = inject('$data');
const usersList : User [] = await $data.getUsers();
const myUSer : User = await $data.getCurrentUser();
const inputVal = ref('');
const listUsersToAdd = ref<User[]>([]);
const firstSixUsers = computed(() => listUsersToAdd.value.slice(0, 6));
const userFound = ref(true);
const userAlreadyAdded = ref(false);
const userIds = props.userIds;

const resetInputVal = () => {
	inputVal.value = '';
	userFound.value = true;
	userAlreadyAdded.value = false;
};

const searchValue = () => {
	for (const user of usersList) {
		if (myUSer.username !== user.username && user.username === inputVal.value) {
			if (isAlreadyAdded(user)) {
				userFound.value = true;
				userAlreadyAdded.value = true;
				return ;
			}
			listUsersToAdd.value.push(user);
			props.userIds?.push(user.id);
			inputVal.value = '';
			userFound.value = true;
			userAlreadyAdded.value = false;
			return ;
		}
	}
	userAlreadyAdded.value = false;
	userFound.value = false;
};

const removeUserFromList = (index : number) => {
	listUsersToAdd.value.splice(index, 1);
	props.userIds?.splice(index, 1);
};

</script>

<style scoped >
.form-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #717171;
  font-weight: 600;
  font-size: 12px;
}

input {
  width: 80%;
  padding: 3% 7%;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  background-color: transparent;
  border: 1px solid #414141;
}

input::placeholder {
  opacity: 0.5;
}

input:focus {
  outline: none;
  border-color: #e81cff;
}

input.is-invalid {
  border-color: #ff0000;
}

ul {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 2px;
  width: 100%;
  height: 100%;
  padding: 2% 0;
  overflow-x: hidden;
  overflow-y: auto;
}

li {
  flex: 0.08 1 16%;
  list-style: none;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 2% 5%;
  border-radius: 8px;
  background-color: #414141;
  cursor: pointer;
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
    right: 70px;
	cursor: pointer;
}
</style>