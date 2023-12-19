<template>
	<div class="header-channel">
		<p>Channel 1</p>
	</div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.header-channel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
  border-bottom: 2.5px solid #fe019a;
}

/*Need to change that */
p {
  background-color: #f3ec78;
  background-image: linear-gradient(45deg, #07cece, #fe019a);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent; 
  -moz-text-fill-color: transparent;
  font-size: 2rem;
  /* color: linear-gradient(blue, pink);*/
  margin: auto;
}
</style>