<template>
	<div class="channel-navbar">
		<ul v-for="channel in channels">
			<ChannelWidget
			:channel="channel"
			:key="channel.id"
			@click="setActiveChannel(channel, currentUser.id)"
			></ChannelWidget>
		</ul>
		<NewChannelWidget title="Add/Join Channel"></NewChannelWidget>
	</div>
</template>

<script setup lang="ts">
import ChannelWidget from './ChannelWidget.vue';
import NewChannelWidget from './NewChannelWidget.vue';
import { Socket } from "socket.io-client";
import { inject, onMounted, computed } from 'vue';
import {ServerEvents, type User} from '@/utils';
import { type SocketManager } from "@/SocketManager";
import notify from '@/notify/notify';

const socketManager: SocketManager = inject('socketManager') as SocketManager;
const $data : any = inject('$data');
const store = $data.getStore();
const socket : Socket = store.socket;
const currentUser = await $data.getCurrentUser();
const channels = computed (() => store.channels);

onMounted(() => {
	$data.loadChannels(currentUser.id);
});

socketManager.addEventListener("user", ServerEvents.dataChanged, async () => {
	$data.loadChannels(currentUser.id);
});

const setActiveChannel = (channel : any, currentUserId: number) => {
	socket.emit('setActiveChannel', {
		'channelId':channel.id,
		'currentUserId':currentUserId
		});
	$data.setActiveChannel(channel);
};

socket.on('newChannelCreated', (newChannelCreated : any) => {
	$data.addChannel(newChannelCreated);
	socket.emit('setActiveChannel', {
		'channelId':newChannelCreated.id,
		'currentUserId':currentUser.id
		});
	$data.setActiveChannel(newChannelCreated);
});

socket.on('channelDeleted', (channelIdDeleted : number) => {
	$data.deleteChannel(channelIdDeleted);
	if (store.channels.length > 0) {
		store.activeChannel = store.channels[store.channels.length - 1];
	} else {
		store.activeChannel = null;
	}
});

socket.on('channelUpdated', (channelUpdated : any) => {
	$data.updateChannel(channelUpdated);
});

socket.on('kicked', (channelId : number) => {
	$data.deleteChannel(channelId);
	if (store.channels.length > 0) {
		store.activeChannel = store.channels[store.channels.length - 1];
	} else {
		store.activeChannel = null;
		store.messages = [];
	}
	notify.newNotification("error", {
		message: "Kicked from channel",
		by: channelId.toString(),
	})
});

</script>center

<style scoped>

.channel-navbar {
    display: flex;
	justify-content: center;
    align-items: center;
    height: 100%;
    border-right: 2px solid #fe019973;
    overflow-x: hidden;
    overflow-y: auto;
    flex-direction: column;
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

</style>