<script setup lang="ts">
	import notify from '../notify';
	import v_notification from './notification.vue';
</script>

<template>
	<button v-on:click="notify.newNotification('gameReady', {by: 'rsabbah'})">Add notif</button>
	<TransitionGroup
		appear
		tag="div"
		id="notifications"
		name="notifications">
		<v_notification
			v-for="(notification, index) in notify.getNotifications()"
			:key="notification.id"
			:data="notification">
		</v_notification>
	</TransitionGroup>
</template>

<style scoped>
	#notifications {
		position: absolute;
		top: 15px;
		right: 15px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		min-width: 400px;
	}

	.notifications-move,
	.notifications-enter-active,
	.notifications-leave-active {
		transition: all 0.5s ease-in-out;
	}

	.notifications-enter-from,
	.notifications-leave-to {
		opacity: 0;
		transform: translate(30px, 0);
	}

	.notifications-leave-active {
		position: absolute;
	}
</style>
