<template>
	<div class="navbar-div">
		<!-- ChannelList -->
		<navbar>
			<p>Channel 1</p>
			<p>Channel 2</p>
			<p>Channel 3</p>
		</navbar>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped>

/* Navbar styles */
.navbar-div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #e0e0e0;
  box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff;
}

navbar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
}

p {
	color: #bebebe;
}
</style>