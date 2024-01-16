<template>
	<div class="form-group">
		<label for="searchChannel">Search :</label>
		<div class="input-container">
			<svg class="search-icon-adduser" width="10px" height="10px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#999494">
				<g id="SVGRepo_bgCarrier" stroke-width="0"/>
				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
				<g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#a3a3a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
			</svg>
			<input 
			v-model="search"
			name="searchChannel"
			id="searchChannel"
			type="text"
			autocomplete="off"
			placeholder="search..."
			>
			<svg v-if="search" class="cancel-icon-adduser-input" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="resetSearch">
				<g id="SVGRepo_bgCarrier" stroke-width="0"/>
				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
				<g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#adadad"/> </g>
			</svg>
		</div>
		<div>
			<ul>
				<li
					v-for="result in searchResults"
					id = "searchResult"
					@click="SelectedResult(result)"
					>
					{{ result.username }}
				</li>
			</ul>
		</div>
		<div>
			<p v-if="listUsersToAdd.length > 0">Users to add :</p>
			<ul>
				<div
					v-for="(user, index) in listUsersToAdd"
					:key="index"
					class="is-selected"
					@click="removeUser(user)"
				>
					<p>{{ user.username }}</p>
				<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="removeUser(user)">
					<g id="SVGRepo_bgCarrier" stroke-width="0"/>
					<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
					<g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#adadad"/> </g>
				</svg>
				</div>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, computed, ref, watch } from 'vue';

interface User {
	id: number;
	username: string;
	email: string;
	avatar: string;
}

const $data : any = inject('$data');
const listUsers = await $data.getUsers();
const currentUser = await $data.getCurrentUser();
const store = $data.getStore();
const search = ref('');
const listUsersToAdd = ref([] as User[]);
const props = defineProps ({
	userIds: {
		type: Array,
	},
});

const searchResults = computed(() => {
	if (search.value.length === 0) {
		return [] as User [];
	} else {
		return listUsers.filter((users: User) => {
			return users.username.toLowerCase().startsWith(search.value.toLowerCase()) && 
					!listUsersToAdd.value.includes(users) && 
						users.id !== currentUser.id;
		});
	}
});

const SelectedResult = (result: User) => {
	props.userIds?.push(result.id);
	listUsersToAdd.value.push(result);
}

const resetSearch = () => {
	search.value = '';
}

const removeUser = (user: User) => {
	const index = listUsersToAdd.value.indexOf(user);
	listUsersToAdd.value.splice(index, 1);
	const index2 = props.userIds?.indexOf(user.id);
	if (index2 !== undefined && index2 !== -1)
		props.userIds?.splice(index2, 1);
}

</script>

<style scoped >

button:not(:disabled):active {
  scale: 0.95;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #717171;
  font-weight: 600;
  font-size: 12px;
}

.form-group input {
  width: 80%;
  padding: 3% 7%;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  background-color: transparent;
  border: 1px solid #414141;
}

.form-group input::placeholder {
  opacity: 0.5;
}

.form-group input:focus {
  outline: none;
  border-color: #e81cff;
}

.form-join-btn {
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

.form-join-btn:not(:disabled):hover {
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
  width: 90%;
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
}

ul::-webkit-scrollbar-track:hover,
ul::-webkit-scrollbar-track:active {
  background-color: transparent;
}

#searchResult {
  display: flex;
  justify-content: space-between;
  list-style: none;
  width: 100%;
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
  display: flex;
  justify-content: space-between;
  list-style: none;
  width: 90%;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  background-color: #313131;
  color: #fff;
  margin: 5px 0;
}

.is-selected:hover {
  background-color: #fff;
  color: #313131;
}

span {
  color: #717171;
}

.input-container {
    position: relative;
}

.search-icon, .cancel-icon {
    position: absolute;display: none;
    top: 45%;
    transform: translateY(-50%);
}

.search-icon-adduser {
  position: absolute;
  left: 7px;
  top: 12px;
}

.is-selected .cancel-icon {
  cursor: pointer;
}

.cancel-icon-adduser-input {
  position: absolute;
  right: 20px;
  top: 10px;
  cursor: pointer;
}

p {
	color: inherit;
}

</style>