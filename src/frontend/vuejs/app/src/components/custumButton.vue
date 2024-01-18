<script setup lang="ts">
	const props = defineProps(["disabled"]);
</script>

<template>
	<button class="custumButton" :disabled="disabled">
		<slot></slot>
	</button>
</template>

<style scoped>
	.custumButton {
		width: 100px;
		border-radius: 0.8rem;
		border: none;
		padding: .5rem;
		cursor: pointer;
		font-size: medium;
		transition: transform 0.5s ease-in-out;
	}

	.custumButton:not(:disabled) {
		background-color: var(--c-pink);
		font-size: medium;
	}

	.custumButton:active {
		animation: bounce 0.5s ease-in-out;
	}
</style>