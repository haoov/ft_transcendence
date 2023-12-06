<script setup lang="ts">
	defineProps(["text"]);
</script>

<template>
	<h1 id="main_title">{{ text }}</h1>
</template>

<style>
	#main_title {
		letter-spacing: 8px;
		text-shadow: 1px 1px 5px var(--c-grey);
	}
</style>