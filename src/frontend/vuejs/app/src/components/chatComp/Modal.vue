<template>
  <div class="modal-overlay" @click="closeModalOutside">
    <div class="modal" @click.stop>
		<slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
	Visibility: Boolean
});
const emit = defineEmits();

function closeModalOutside() {
	emit('update:Visibility', '');
}

</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: transparent;
	backdrop-filter: blur(5px);
	display: flex;
	justify-content: center;
	align-items: center;
}
.modal {
	position: relative;
	width: fit-content;
	height: fit-content;
	display: flex;
	justify-content: center;
	align-items: center;
}

</style>