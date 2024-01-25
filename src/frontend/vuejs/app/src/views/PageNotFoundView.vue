<script setup lang="ts">
	import navigationBar from '@/components/navigationBar.vue';
</script>

<template>
	<div class="full_body">
		<navigationBar></navigationBar>
		<div class="not_found body">
			<h3 class="error_title">Looks like you're lost</h3>
			<a class="error_text">I used to be an adventurer like you.</a>
			<a class="error_text">Then I took an arrow in the knee...</a>
		</div>
	</div>
</template>

<style scoped>
	.full_body {
		height: 100%;
		overflow-x: hidden;
		background: linear-gradient(to right,var(--c-black),var(--c-blue-dark),var(--c-black));
	}

	.not_found.body {
		height: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.error_title {
		font-size: xxx-large;
		color: var(--c-white);
	}

	.error_text {
		font-size: large;
		color: var(--c-white);
	}

</style>