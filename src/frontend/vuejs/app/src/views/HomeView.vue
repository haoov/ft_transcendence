<script setup lang="ts">
	import Leaderboard from '@/components/leaderboard.vue';
	import navigationBar from '@/components/navigationBar.vue';
	import Notification from '@/components/notification.vue';
	import STF from '@/STF';
	import router from '@/router';
	import { ClientEvents, ServerEvents } from '@/utils';

	const stf = new STF();
	const socket = await stf.connectNewSocket();
</script>

<template>
    <div class="home-body">
	    <navigationBar></navigationBar>
      <Suspense><Leaderboard></Leaderboard></Suspense>
			<Notification
				:display="stf.getDisplayValue(ServerEvents.gameReady)"
				text="Ready to play!"
				v-on:decline="socket.emit(ClientEvents.gameForfeit)"
				v-on:accept="socket.emit(ClientEvents.gamePlay); router.push('/game');"
			></Notification>
    </div>
</template>

<style>

	.home-body {
			height: 100%;
			background: linear-gradient(to right, var(--c-black), var(--c-blue-dark), var(--c-black));
	}


</style>
@/injectables/STF