<script setup lang="ts">
	import type { User, UserRelation } from '@/utils';
	import addFriendIcon from '@/assets/images/friend-add.png';
	import friendPendingIcon from '@/assets/images/friend-pending.png';
	import friendRemoveIcon from '@/assets/images/friend-remove.png';
	import blockIcon from '@/assets/images/status-blocked-32.png';
	import unblockIcon from '@/assets/images/unblock-50.png';
	import onlineIcon from '@/assets/images/status-online-32.png';
	import offlineIcon from '@/assets/images/status-offline-32.png';
	import playingIcon from '@/assets/images/status-playing-32.png';

	const props = defineProps<{user: UserRelation}>();
</script>

<template>
	<div id="userWidget">
		<img
			id="userWidgetIcon"
			:src="user.avatar">
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
				background-color: var(--c-black-light);
				box-shadow: 0 0 0 0.4rem var(--c-black-light);
			}
			&:active {
				transform: scale(0.9);
			}
		}
	}
</style>