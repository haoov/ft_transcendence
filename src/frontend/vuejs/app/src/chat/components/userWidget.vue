<script setup lang="ts">
	import type { User, UserRelation } from '@/utils';
	import blockIcon from '@/assets/images/status-blocked-32.png';
	import onlineIcon from '@/assets/images/status-online-32.png';
	import offlineIcon from '@/assets/images/status-offline-32.png';
	import playingIcon from '@/assets/images/status-playing-32.png';
	import { computed } from 'vue';
import { socketManager } from '@/SocketManager';

	const props = defineProps<{user: UserRelation}>();

	const statusIcon = computed(() => {
		if (props.user) {
			if (props.user.blocked)
				return (blockIcon);
			if (props.user.status == "undefined" || props.user.status == "offline")
				return (offlineIcon);
			if (props.user.status == "playing")
				return (playingIcon);
			else if (props.user.status == "online")
				return (onlineIcon);
		}
		return ("");
	});
</script>

<template>
	<div id="userWidget">
		<div id="iconContainer">
			<img
				id="userWidgetIcon"
				:src="user.avatar">
			<img v-if="user.id == socketManager.getUser().id || (user.friend == true && !user.blocking)" id="statusIcon" :src="statusIcon">
		</div>
		<div id="userInfos">
			<span id="username">{{ user.username }}</span>
		</div>
	</div>
</template>

<style scoped>
	#userWidget {
		display: flex;
		justify-content: flex-start;
	}

	#iconContainer {
		position: relative;
		display: inline-block;
	}

	#statusIcon {
		position: absolute;
		bottom: 0.3rem;
		right: 0.2rem;
		width: 1.5rem;
		height: 1.5rem;
	}

	#userWidgetIcon {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	#userInfos {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		margin-left: 10px;
		border-bottom: 1px solid var(--c-black-light);

		span {
			width: fit-content;
			cursor: pointer;

			&:hover {
				border-radius: 3px;
				background-color: var(--c-black-light);
				box-shadow: 0 0 0 0.4rem var(--c-black-light);
			}
			&:active {
				transform: scale(0.9);
			}
		}
	}
</style>