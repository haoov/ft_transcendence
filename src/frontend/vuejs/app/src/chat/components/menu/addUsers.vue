<script setup lang="ts">
	import { chat, type ChannelParams, Channel } from '@/chat';
	import type { User } from '@/utils';
	import { computed, ref, type Ref } from 'vue';
	import { socketManager } from '@/SocketManager';
	import cancelIcon from '@/assets/images/cancelIcon.png';

	const props = defineProps<{
		channelParams: ChannelParams | undefined,
		channel: Channel | undefined,
	}>();

	const emit = defineEmits({
		add: (user: User) => user,
		remove: (user: User) => user,
	});

	const addableUsers: User[] = await chat.getAddableUsers(props.channel, socketManager.getUser());

	const usersToAdd: Ref<User[]> = ref([]);
	
	const search: Ref<string> = ref('');

	const searchResults = computed((): User[] => {
		if (search.value.length == 0)
			return [];
		else {
			return addableUsers.filter((user: User) => {
				return	(user.username.toLowerCase().startsWith(search.value.toLowerCase())
								&& !usersToAdd.value.includes(user));
			});
		}
	});

	function addUser(user: User) {
		usersToAdd.value.push(user);
		emit('add', user);
		search.value = '';
	}

	function removeUser(user: User) {
		usersToAdd.value.splice(usersToAdd.value.indexOf(user), 1);
		emit('remove', user);
	}
</script>

<template>
	<div id="addUsers">
		<label id="inputLabel">
			Add Users :
			<div id="usersToAdd">
				<div
					class="userToAdd"
					v-for="user in usersToAdd">
					{{ user.username }}
					<img
						id="removeIcon"
						:src="cancelIcon"
						v-on:click="removeUser(user)">
				</div>
			</div>
			<div class="inputContainer">
				<img id="searchIcon">
				<input id="searchUsers"
					type="text"
					autocomplete="off"
					placeholder="Search..."
					v-model="search">
			</div>
		</label>
		<div id="searchResults">
			<div
				class="searchResult"
				v-for="user in searchResults"
				v-on:click="addUser(user)">
				{{ user.username }}
			</div>
		</div>
	</div>
</template>

<style scoped>
	#inputLabel {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: small;

		#searchUsers {
			width: 80%;
			padding: 3% 7%;
			border-radius: 8px;
			color: var(--c-white);
			background-color: transparent;
			border: 1px solid var(--c-grey);
		}
	}

	#searchResults {
		position: absolute;
		display: flex;
		flex-direction: column;
		background-color: var(--c-grey);

		.searchResult {
			display: flex;
			align-items: center;
			padding: 5px;
			font-size: small;
			color: var(--c-black-light);
			width: 100px;
			cursor: pointer;
		}
	}

	#usersToAdd {
		display: flex;
		gap: 5px;

		.userToAdd {
			display: flex;
			font-size: small;
			color: var(--c-grey-light);
			background-color: var(--c-black-light);
			padding: 3px;

			#removeIcon {
				width: 15px;
				height: 15px;
				cursor: pointer;
			}
		}
	}
</style>