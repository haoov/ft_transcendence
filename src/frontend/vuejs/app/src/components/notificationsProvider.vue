<script setup lang="ts">
	import { ref } from 'vue';
	import v_notification from './notification.vue';

	const notifs = ref<string[]>([]);
	let count = ref(0);
</script>

<template>
	<button @click="notifs.splice(0, 0, 'Notification' + count.toString()); ++count">Add notification</button>
	<button @click="notifs.splice(0,1)">Remove notification</button>
	<TransitionGroup
		appear
		tag="div"
		id="notifications"
		name="notifications">
		<v_notification
			v-for="notif in notifs"
			:key="notif"
			:text="notif"
		></v_notification>
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
		transform: translateX(30px);
	}

	.notifications-leave-active {
		position: absolute;
	}
</style>
