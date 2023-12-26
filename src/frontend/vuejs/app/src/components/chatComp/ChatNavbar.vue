<template>
	<div class="channel-navbar">
		<nav>
			<ul v-for="(channel, index) in channels">
				<ChannelWidget
				:channel="channel"
				:key="index"
				@click="setActiveChannel(channel)"
				></ChannelWidget>
			</ul>
			<NewChannelWidget></NewChannelWidget>
		</nav>
	</div>
</template>

<script setup lang="ts">
import ChannelWidget from './ChannelWidget.vue';
import NewChannelWidget from './NewChannelWidget.vue';
import { inject, onMounted, computed } from 'vue';

const $data : any = inject('$data');
const store = $data.getStore();
const channels = computed (() => store.channels);

onMounted(() => {
	$data.loadChannels();
});

const setActiveChannel = (channel : any) => {
	$data.setActiveChannel(channel);
};

</script>

<style scoped>

.channel-navbar {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: transparent;
	border-right: 2px solid #fe019973;
	overflow-x: hidden;
	overflow-y: auto;
}

nav {
	display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
	overflow-x: hidden;
	overflow-y: auto;
}

nav ul {
	margin-bottom: 3%;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 8px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: #07cece;
  box-shadow:0 0 6px #07cece;
}

::-webkit-scrollbar-track:hover,
::-webkit-scrollbar-track:active {
  background-color: transparent;
}

</style>