<script setup lang="ts">
	import v_channel from './channel.vue';
	import chat from '@/chat/chat';
</script>

<template>
	<button v-on:click="chat.testChannels()">TEST</button>
	<TransitionGroup
		appear
		tag="div"
		id="channels"
		name="channels">
		<v_channel
			v-for="channel in chat.getActiveChannels()"
			:key="channel.getId()"
			:channel="channel">
		</v_channel>
	</TransitionGroup>
</template>

<style scoped>
	#channels {
		position: absolute;
		bottom: 0px;
		right: 15px;
		display: flex;
		flex-direction: row-reverse;
		gap: 10px;
	}
</style>