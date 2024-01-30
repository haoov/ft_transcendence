<script setup lang="ts">
	import v_sideBar from './sideBar.vue';
	import v_channel from './channel.vue';
	import v_chatMenu from './menu/chatMenu.vue';
	import { ref, watch, type Ref } from 'vue';
	import { chat, type Channel } from '@/chat';

	const currentChannel: Ref<Channel | undefined> = ref<any>(chat.getChannels()[0]);
	watch(chat.getChannels(), () => {
		if (currentChannel.value) {
			const channel = chat.getChannel(currentChannel.value.getId());
			if (channel) {
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
		max-height: 1000px;
		max-width: 1000px;
		margin-top: 20px;
		margin-bottom: 5px;
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		background-color: var(--c-surface);
	}
</style>