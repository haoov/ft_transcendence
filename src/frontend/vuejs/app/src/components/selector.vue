<script setup lang="ts">
	defineProps(["label", "values", "preSelected"]);
	const emit = defineEmits(['select']);

	function selectValue(value: string) {
		emit("select", value);
	}
</script>

<template>

	<div id="selection">
		<label id="selectorLabel">
			{{ label }}
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
		</label>
	</div>

</template>

<style scoped>

	#selectorLabel {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: small;
		color: var(--c-grey);
	}

	.radio-inputs {
		display: flex;
}

	.radio {
		display: flex;
		text-align: center;
	}

	.radio input {
		display: none;
	}

	.name {
		min-width: 70px;
		font-size: small;
		cursor: pointer;
		border-radius: 0.8rem;
		border: none;
		padding: 0.5rem 0;
		background-color: transparent;
		color: var(--c-grey);
		transition: all .10s ease-in-out;
	}

	.radio input:checked + .name {
		background-color: var(--c-white);
	}

</style>