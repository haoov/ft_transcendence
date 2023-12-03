<script setup lang="ts">
	import mainTitle from '../components/mainTitle.vue'
</script>

<template>
	<div class="main_header">
		<mainTitle></mainTitle>
		<img src="@/assets/images/menu-bars.png">
	</div>
</template>

<style>
	.main_header {
		display: flex;
		height: 60px;
		align-items: center;
		justify-content: space-between;
		background-color: var(--c-blue-dark);
	}
</style>
