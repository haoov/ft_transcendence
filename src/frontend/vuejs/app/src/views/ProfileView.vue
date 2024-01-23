<script setup lang="ts">
	import Profile from '@/components/profile.vue';
	import navigationBar from '@/components/navigationBar.vue';
	import gameNotification from '@/game/components/gameNotification.vue';
	import GlobalSocket from '@/GlobalSocket';
	import router from '@/router';
	import { ServerEvents } from '@/utils';
	import { inject } from 'vue';

	const globalSocket: GlobalSocket = inject("globalSocket") as GlobalSocket;
</script>

<template>
    <div class="profile-body">
		<navigationBar></navigationBar>
    	<Suspense><Profile></Profile></Suspense>
    </div>
</template>

<style>

	.profile-body {
			overflow-x: hidden;
			height: 100%;
			background: linear-gradient(to right, var(--c-black), var(--c-blue-dark), var(--c-black));
	}


</style>
