<template>
	<div class="navbar-div">
		<nav>
			<NewChannelWidget></NewChannelWidget>
			<!-- <ul v-for="channel in channels" :key="channel.id">
				<ChannelWidget :channel="channel"></ChannelWidget> -->
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
  background: transparent;
  border-right: 2.5px solid #fe019a;
}

nav {
  display: grid;
  grid-template-rows:repeat(4,1fr);
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>