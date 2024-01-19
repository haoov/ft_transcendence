<script setup lang="ts">
	import Leaderboard from '@/components/leaderboard.vue';
	import navigationBar from '@/components/navigationBar.vue';
	import GlobalSocket from '@/GlobalSocket';
	import { inject } from 'vue';
	import v_notify from '@/notify/components/notify.vue';

	const globalSocket: GlobalSocket = inject("globalSocket") as GlobalSocket;
	console.log(import.meta.env.VITE_HOSTNAME);
</script>

<template>
    <div class="home-body">
	    <navigationBar></navigationBar>
      <Suspense><Leaderboard></Leaderboard></Suspense>
    </div>
</template>

<style>
	.home-body {
			height: 100%;
			background: linear-gradient(to right, var(--c-black), var(--c-blue-dark), var(--c-black));
	}
</style>
