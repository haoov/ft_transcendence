<script setup lang="ts">
	import { chat, Channel } from '@/chat';
	import cancelIcon from '@/assets/images/cancelIcon.png';
	import { computed, reactive, ref, type Ref } from 'vue';
	import v_userWidget from '../userWidget.vue';
	import { ServerEvents, type User, type UserRelation } from '@/utils';
	import { socketManager } from '@/SocketManager';

	const props = defineProps<{channel: Channel | undefined}>();
	const emit = defineEmits({selectUser: (user: UserRelation) => user});
	const search: Ref<string> = ref('');
	const userRelations = ref<UserRelation[]>(props.channel ? await chat.getChannelRelations(props.channel) : []);

	const usersToDisplay = computed(() => {
		if (!search.value)
			return userRelations.value;
		return userRelations.value.filter((userRelation: UserRelation) => {
			return userRelation.username.toLowerCase().startsWith(search.value.toLowerCase());
		});
	});

	socketManager.addEventListener("user", ServerEvents.dataChanged, async (user: User) => {
		props.channel ? userRelations.value = await chat.getChannelRelations(props.channel) : [];
	});
</script>

<template>
	<div id="usersMenu">
		<div id="header">
			<div></div>
			<div id="title">Users</div>
			<div id="closeButton" v-on:click="chat.setChatMenu('none')">
				<img id="closeIcon"
					:src="cancelIcon">
			</div>
		</div>
		<div id="body">
			<div class="inputContainer">
				<img id="searchIcon">
				<input id="searchUser"
					type="text"
					autocomplete="off"
					placeholder="Search..."
					v-model="search">
			</div>
			<TransitionGroup id="users"
				appear
				tag="div"
				name="users">
				<v_userWidget
					v-for="user in usersToDisplay"
					:user="user"
					v-on:click="emit('selectUser', user)">
				</v_userWidget>
			</TransitionGroup>
		</div>
	</div>
</template>

<style scoped>
	#usersMenu {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 300px;
		gap: 30px;
		padding: 30px;
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		background-color: var(--c-surface);
	}

	#header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		#title {
			font-size: large;
			font-weight: bold;
			text-decoration: underline;
			text-decoration-color: var(--c-pink);
			text-decoration-thickness: 2px;
			text-underline-offset: 5px;
			animation: underline-animation 10s infinite
		}
	}

	#body {
		display: flex;
		flex-direction: column;
		width: 100%;

		#searchUser {
			width: 100%;
			height: 30px;
			border: none;
			border-radius: 5px;
			padding: 5px 20px;
			margin-bottom: 10px;
			box-sizing: border-box;
			background-color: var(--c-black-light);
		}

		#users {
			display: flex;
			gap: 10px;
			flex-direction: column;
		}
	}
</style>