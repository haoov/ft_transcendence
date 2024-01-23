<script setup lang="ts">
	import Leaderboard from '@/components/leaderboard.vue';
	import navigationBar from '@/components/navigationBar.vue';
</script>

<template>
    <div class="home-body">
	    <navigationBar></navigationBar>
      <Suspense><Leaderboard></Leaderboard></Suspense>
    </div>
</template>

<style>
	.home-body {
			overflow-x: hidden;
			height: 100%;
			background: linear-gradient(to right, var(--c-black), var(--c-blue-dark), var(--c-black));
	}
</style>
