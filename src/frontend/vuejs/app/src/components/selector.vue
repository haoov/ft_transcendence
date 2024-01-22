<script setup lang="ts">
	defineProps(["label", "values", "preSelected"]);
	const emit = defineEmits(['select']);

	function selectValue(value: string) {
		emit("select", value);
	}
</script>

<template>

	<div class="selection">
		<label>{{ label }}</label>
		<div class="radio-inputs">
			<label class="radio" v-for="value in values">
				<input
					type="radio"
					:value="value"
					:name="label"
					:checked="value == preSelected"
					v-on:click="selectValue(value)">
					<span class="name">{{ value }}</span>
			</label>
		</div>
	</div>

</template>

<style scoped>

	.selection {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.radio-inputs {
		display: flex;
		padding: 0.25rem;
}

	.radio {
		display: flex;
		margin: 5px;
		text-align: center;
	}

	.radio input {
		display: none;
	}

	.name {
		width: 100px;
		cursor: pointer;
		border-radius: 0.8rem;
		border: none;
		padding: 0.5rem;
		background-color: var(--c-grey);
		transition: all .10s ease-in-out;
	}

	.radio input:checked + .name {
		background-color: var(--c-pink);
		font-weight: 600;
	}

</style>