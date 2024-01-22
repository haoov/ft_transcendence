<script setup lang="ts">
	const props = defineProps(["disabled"]);
</script>

<template>
	<button class="custumButton" :disabled="disabled ? disabled : false">
		<slot></slot>
	</button>
</template>

<style>
	.custumButton {
		width: 100px;
		border-radius: 0.8rem;
		border: none;
		padding: .5rem;
		font-size: medium;
		transition: transform 0.1s ease-in-out;
	}

	.custumButton:disabled {
		background-color: var(--c-grey);
		cursor: not-allowed;
	}

	.custumButton:not(:disabled) {
		background-color: var(--c-pink);
		cursor: pointer;
	}

	.custumButton:not(:disabled):hover {
		transform: scale(1.05);
	}

	.custumButton:not(:disabled):active {
		transform: scale(0.95);
	}
</style>