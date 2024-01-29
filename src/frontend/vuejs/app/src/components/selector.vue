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
	#selection {
		width: 100%;
		padding-bottom: 5px;
		padding-top: 5px;
		border-bottom: 1px solid var(--c-black-light);
		border-top: 1px solid var(--c-black-light);
	}

	#selectorLabel {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 1.4rem;
	}

	.radio-inputs {
		display: flex;
		gap: 10px;
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
		padding: 0.5rem;
		background-color: transparent;
		color: var(--c-grey);
		transition: all .10s ease-in-out;
	}

	.radio input:checked + .name {
		background-color: var(--c-white);
	}

</style>