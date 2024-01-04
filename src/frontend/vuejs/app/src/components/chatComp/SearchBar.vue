<template>
	<div  class="form-group">
			<label for="channelUsers">Add Users</label>
			<p v-if="!userFound" style="color: red;">User not found</p>
			<p v-if="userAlreadyAdded" style="color: red;">User already added</p>
			<input
				type="search"
				id="channelUsers"
				placeholder="Search users"
				autocomplete="off"
				spellcheck="false"
				v-model="inputVal"
				@keyup.enter="searchValue"
				@keydown.enter.prevent
				:class="{ 'is-invalid': inputVal.length > 0 && (!userFound || userAlreadyAdded)}"
			>
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
		// if (user.username === inputVal.value) {
		// 	listUsersToAdd.value.push(user);
		// }
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

</style>