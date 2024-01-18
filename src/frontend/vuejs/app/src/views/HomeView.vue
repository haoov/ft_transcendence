<script setup lang="ts">
	import Leaderboard from '@/components/leaderboard.vue';
	import navigationBar from '@/components/navigationBar.vue';
	import gameNotification from '@/game/components/gameNotification.vue';
	import GlobalSocket from '@/GlobalSocket';
	import router from '@/router';
	import { ClientEvents, ServerEvents } from '@/utils';
	import { inject, onMounted } from 'vue';
	import NotificationsProvider from '@/components/notificationsProvider.vue';

	const globalSocket: GlobalSocket = inject("globalSocket") as GlobalSocket;
	console.log(import.meta.env.VITE_HOSTNAME);
</script>

<template>
    <div class="home-body">
	    <navigationBar></navigationBar>
      <Suspense><Leaderboard></Leaderboard></Suspense>
			<gameNotification
				:display="globalSocket.getDisplayValue(ServerEvents.gameReady)"
				text="Ready to play!"
				v-on:close="router.push('/game');"
			></gameNotification>
			<NotificationsProvider></NotificationsProvider>
    </div>
</template>

<style>

	.home-body {
			height: 100%;
			background: linear-gradient(to right, var(--c-black), var(--c-blue-dark), var(--c-black));
	}


</style>
