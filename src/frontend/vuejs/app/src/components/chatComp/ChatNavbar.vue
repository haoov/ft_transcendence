<template>
	<div class="navbar-div">
		<nav>
			<NewChannelWidget @update:Visibility="openNewChannelForm"></NewChannelWidget>
			<ul v-for="(channel, index) in channels">
				<ChannelWidget
				:channel="channel"
				:key="index"
				></ChannelWidget>
			</ul>
		</nav>
	</div>
</template>

<script setup lang="ts">
	import ChannelWidget from './ChannelWidget.vue';
	import NewChannelWidget from './NewChannelWidget.vue';
	import { inject } from 'vue';

	const $data : any = inject('$data');
	const channels = await $data.getChannels();
	console.log('channels ->', channels);

	const emit = defineEmits();
	const openNewChannelForm = () => {
		emit('update:Visibility', '');
	};

	const updateActiveChannel = ( channelClicked: any ) => {
		console.log('channelClicked', channelClicked);
		// emit('update:ActiveChannel', channels[0]);
	};

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
  border-right: 2px solid #fe019973;
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