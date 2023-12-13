<template>
	<div class="navbar-div">
		<nav>
			<NewChannelWidget></NewChannelWidget>
			<ChannelWidget></ChannelWidget>
			<ChannelWidget></ChannelWidget>
			<ChannelWidget></ChannelWidget>
		</nav>
	</div>
</template>

<script setup lang="ts">
import ChannelWidget from './ChannelWidget.vue';
import NewChannelWidget from './NewChannelWidget.vue';

</script>

<style scoped>
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

nav {
  display: grid;
  grid-template-rows:repeat(4,1fr);
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  /* overflow: scroll; */
}
</style>