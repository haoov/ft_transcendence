<template>
  <div class="modal-overlay">
    <div class="modal">
		<slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
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
	width: 50%;
	height: 75%;
	display: flex;
	justify-content: center;
	align-items: center;
}

</style>