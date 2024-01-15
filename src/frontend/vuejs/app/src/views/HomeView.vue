<script setup lang="ts">
	import Leaderboard from '@/components/leaderboard.vue';
	import navigationBar from '@/components/navigationBar.vue';
	import Notification from '@/components/notification.vue';
	import GlobalSocket from '@/GlobalSocket';
	import router from '@/router';
	import { ClientEvents, ServerEvents } from '@/utils';
	import { inject } from 'vue';

	const globalSocket: GlobalSocket = inject("globalSocket") as GlobalSocket;
</script>

<template>
    <div class="home-body">
	    <navigationBar></navigationBar>
      <Suspense><Leaderboard></Leaderboard></Suspense>
			<Notification
				:display="globalSocket.getDisplayValue(ServerEvents.gameReady)"
				text="Ready to play!"
				v-on:decline="globalSocket.getSocket().emit(ClientEvents.gameForfeit)"
				v-on:accept="globalSocket.getSocket().emit(ClientEvents.gamePlay); router.push('/game');"
			></Notification>
    </div>
</template>

<style>

	.home-body {
			height: 100%;
			background: linear-gradient(to right, var(--c-black), var(--c-blue-dark), var(--c-black));
	}


</style>
