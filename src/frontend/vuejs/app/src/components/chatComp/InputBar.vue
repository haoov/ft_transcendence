<template>
	<div class="input-bar-div">
		<form class="form-message">
			<input type="text" autocomplete="off" name="text" class="input" placeholder="messages">
		</form>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.input-bar-div {
  display: flex;
  justify-content: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Form and paragraph styles */
.form-message {
  display: flex;
  justify-content: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.input {
  border: none;
  outline: none;
  padding: 1em;
  background-color: #ccc;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.3);
  transition: 300ms ease-in-out;
  width: 100%;
  margin-top: auto;
}

.input:focus {
  color : black;
  background-color: white;
  transform: scale(1.05);
  box-shadow: 13px 13px 100px #969696, -13px -13px 100px #ffffff;
}

</style>