<script setup lang="ts">
	import Profile from '@/components/profile.vue';
	import navigationBar from '@/components/navigationBar.vue';
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
