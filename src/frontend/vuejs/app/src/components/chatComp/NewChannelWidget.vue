<template>
	<div
		class="circle-container"
		v-if="!isFormVisible"
		@click="toggleFormVisibility"
	>
		<p>+</p>
	</div>
	<div class="form-container" v-if="isFormVisible">
		<form  @submit.prevent="submitForm">
			<input type="text" placeholder="Channel Name" />
			<input type="text" placeholder="Channel Description" />
			<button type="submit">Create Channel</button>
		</form>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const boxIsChecked = ref(false);
const isFormVisible = ref(false);

const toggleFormVisibility = () => {
	console.log('toggling form visibility');
	isFormVisible.value = !isFormVisible.value;
}

const submitForm = () => {
	console.log('submitting form');
}

</script>


<style scoped>
.circle-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #a1a0a0;
  display: flex;
  align-items: center;
  justify-content: center;
}

p {
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.form-container {
	position: fixed;
	border: 1px solid #fe019a;
	width: 100%;
	height: 100%;
	z-index: 1;
}

</style>