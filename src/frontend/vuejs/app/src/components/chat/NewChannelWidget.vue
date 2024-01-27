<template>
	<div
		class="circle-container"
		@click="openNewChannelForm"
	>
		<p>+</p>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const $data: any = inject('$data');

const emit = defineEmits();
const openNewChannelForm = () => {
	$data.openModalForm();
};

</script>

<style scoped>
.circle-container {
  width: 50px;
  height: 50px;
  min-height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #a1a0a0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 5%;
  border: 0.5px solid #fff;
}

p {
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

</style>