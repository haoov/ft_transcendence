<template>
	<div class="channel-navbar">
		<ul v-for="channel in store.channels">
			<ChannelWidget
			:channel="channel"
			:key="channel.id"
			@click="setActiveChannel(channel)"
			></ChannelWidget>
		</ul>
		<NewChannelWidget title="Add/Join Channel"></NewChannelWidget>
	</div>
</template>

<script setup lang="ts">
import ChannelWidget from './ChannelWidget.vue';
import NewChannelWidget from './NewChannelWidget.vue';
import { inject, onMounted, computed } from 'vue';
import {ChatEvents, ServerEvents, type User} from '@/utils';
import { type SocketManager } from "@/SocketManager";
import notify from '@/notify/notify';

const socketManager: SocketManager = inject('socketManager') as SocketManager;
const $data : any = inject('$data');
const store = $data.getStore();
const currentUser = await $data.getCurrentUser();

onMounted(() => {
	$data.loadChannels(currentUser.id);
});

socketManager.addEventListener("user", ServerEvents.dataChanged, async () => {
	$data.loadChannels(currentUser.id);
});

const setActiveChannel = (channel : any) => {
	socketManager.setActiveChannel(channel.id);
	$data.setActiveChannel(channel);
};

function userAddedHandler(channelJoined: any) {
	$data.addChannel(channelJoined);
}

function newChannelCreatedHandler(newChannelCreated : any) {
	console.log(newChannelCreated);
	$data.addChannel(newChannelCreated);
	if (newChannelCreated.creatorId == currentUser.id) {
		socketManager.setActiveChannel(newChannelCreated.id);
		$data.setActiveChannel(newChannelCreated);
	}
}

function channelIdDeletedHandler(channelIdDeleted : number) {
	$data.deleteChannel(channelIdDeleted);
	if (store.channels.length > 0) {
		store.activeChannel = store.channels[store.channels.length - 1];
		socketManager.setActiveChannel(store.activeChannel.id);
	} else {
		store.activeChannel = null;
		store.messages = [];
		socketManager.setActiveChannel(0);
	}
}

function channelUpdatedHandler(channelUpdated : any) {
	$data.updateChannel(channelUpdated);
}

function KickedHandler(channelId : number) {
	const channel = $data.findChannelById(channelId);
	notify.newNotification("error", {
		message: "Kicked from channel",
		by: channel.name,
	})
	$data.deleteChannel(channelId);
	if (store.channels?.length > 0) {
		store.activeChannel = store.channels[store.channels.length - 1];
		store.activeChannel = store.channels[store.channels.length - 1];
		socketManager.setActiveChannel(store.activeChannel.id);
	} else {
		store.activeChannel = null;
		store.messages = [];
		socketManager.setActiveChannel(0);
	}
}

function bannedHandler(channelId : number) {
	const channel = $data.findChannelById(channelId);
	notify.newNotification("error", {
		message: "Banned from channel",
		by: channel.name,
	})
	$data.deleteChannel(channelId);
	if (store.channels?.length > 0) {
		store.activeChannel = store.channels[store.channels.length - 1];
		store.activeChannel = store.channels[store.channels.length - 1];
		socketManager.setActiveChannel(store.activeChannel.id);
	} else {
		store.activeChannel = null;
		store.messages = [];
		socketManager.setActiveChannel(0);
	}
}

function adminNomination(channelId: number) {
	const channel = $data.findChannelById(channelId);
	notify.newNotification("error", {
		message: "You have been named administrator of",
		by: channel.name,
	})
}

onMounted(() => {
	if (!socketManager.hasEventListener("chat", ChatEvents.newChannelCreated)) {
		// console.log('[ChatEvents.newChannelCreated]');
		socketManager.addEventListener("chat", ChatEvents.newChannelCreated, newChannelCreatedHandler);
	}
	if (!socketManager.hasEventListener("chat", ChatEvents.userAdded)) {
		// console.log('[ChatEvents.userAdded]');
		socketManager.addEventListener("chat", ChatEvents.userAdded, userAddedHandler);
	}
	if (!socketManager.hasEventListener("chat", ChatEvents.channelDeleted)) {
		// console.log('[ChatEvents.channelDeleted]');
		socketManager.addEventListener("chat", ChatEvents.channelDeleted, channelIdDeletedHandler);
	}
	if (!socketManager.hasEventListener("chat", ChatEvents.channelUpdated)) {
		// console.log('[ChatEvents.channelUpdated]');
		socketManager.addEventListener("chat", ChatEvents.channelUpdated, channelUpdatedHandler);
	}
	if (!socketManager.hasEventListener("chat", ChatEvents.kicked)) {
		// console.log('[ChatEvents.kicked]');
		socketManager.addEventListener("chat", ChatEvents.kicked, KickedHandler);
	}
	if (!socketManager.hasEventListener("chat", ChatEvents.banned)) {
		// console.log('[ChatEvents.banned]');
		socketManager.addEventListener("chat", ChatEvents.banned, bannedHandler);
	}
	if (!socketManager.hasEventListener("chat", ChatEvents.namedAdmin)) {
		// console.log('[ChatEvents.namedAdmin]');
		socketManager.addEventListener("chat", ChatEvents.namedAdmin, adminNomination);
	}
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