<script setup lang="ts">
	import v_sideBar from './sideBar.vue';
	import v_channel from './channel.vue';
	import v_chatMenu from './chatMenu.vue';
	import { ref, watch, type Ref } from 'vue';
	import { chat, type Channel } from '@/chat';

	const currentChannel: Ref<Channel | undefined> = ref<Channel>();
	watch(chat.getChannels(), (channels) => {
		if (currentChannel.value) {
			const channel = chat.getChannel(currentChannel.value.getId());
			if (channel && channel != currentChannel.value) {
				currentChannel.value = channel;
			}
		}
	})
</script>

<template>
	<!--CHAT-->
	<div id="chat">
		<v_sideBar
			v-on:setCurrentChannel="(channel) => {currentChannel = channel}">
		</v_sideBar>
		<v_channel :channel="currentChannel"></v_channel>
	</div><!--CHAT END-->
	<v_chatMenu :channel="currentChannel"></v_chatMenu>
</template>

<style scoped>
	#chat {
		display: flex;
		align-items: flex-start;
		height: 90%;
		width: 90%;
		margin-top: 20px;
		margin-bottom: 5px;
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		background-color: var(--c-surface);
	}
</style>