<template>
	<div class="join-channel-form-container">
		<form class="form" @submit.prevent="submitForm">
			<div class="form-group">
				<p>test</p>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">

const submitForm = () => {
	console.log('test');
}
</script>

<style scoped>
</style>