<template>
	<div class="channel-navbar">
		<ul v-for="channel in channels">
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
import { Channel } from '@/chat/classes';

const socketManager: SocketManager = inject('socketManager') as SocketManager;
const $data : any = inject('$data');
const store = $data.getStore();
const currentUser = await $data.getCurrentUser();
const channels = computed (() => store.channels);

socketManager.addEventListener("user", ServerEvents.dataChanged, async () => {
	$data.loadChannels(currentUser.id);
});

const setActiveChannel = (channel : Channel) => {
	socketManager.setActiveChannel(channel);
	$data.setActiveChannel(channel);
};

function userAddedHandler(channelJoined: any) {
	$data.addChannel(channelJoined);
}

function newChannelCreatedHandler(data: any) {
	const newChannelCreated = new Channel(
		data.id,
		data.name,
		data.mode,
		data.creatorId,
		data.password,
	)
	$data.addChannel(newChannelCreated);
	if (newChannelCreated.getCreatorId() == currentUser.id) {
		socketManager.setActiveChannel(newChannelCreated);
		$data.setActiveChannel(newChannelCreated);
	}
}

function channelIdDeletedHandler(channelIdDeleted : number) {
	$data.deleteChannel(channelIdDeleted);
	if (store.channels.length > 0) {
		store.activeChannel = store.channels[store.channels.length - 1];
		socketManager.setActiveChannel(store.activeChannel);
	} else {
		store.activeChannel = null;
		socketManager.resetActiveChannel();
	}
}

function channelUpdatedHandler(channelUpdated : any) {
	$data.updateChannel(channelUpdated);
}

async function KickedHandler(channelId : number) {
	const channel = $data.findChannelById(channelId);
	notify.newNotification("error", {
		message: "Kicked from channel",
		by: channel.name,
	})
	$data.deleteChannel(channelId);
	if (store.channels?.length > 0) {
		store.activeChannel = store.channels[store.channels.length - 1];
		socketManager.setActiveChannel(store.activeChannel);
	} else {
		store.activeChannel = null;
		store.messages = [];
		socketManager.resetActiveChannel();
	}
}

async function bannedHandler(channelId : number) {
	const channel = $data.findChannelById(channelId);
	notify.newNotification("error", {
		message: "Banned from channel",
		by: channel.name,
	})
	$data.deleteChannel(channelId);
	if (store?.channels.length > 0) {
		store.activeChannel = store.channels[store.channels.length - 1];
		socketManager.setActiveChannel(store.activeChannel);
	} else {
		store.activeChannel = null;
		store.messages = [];
		socketManager.resetActiveChannel();
	}
}

onMounted(() => {
	if(!socketManager.hasEventListener("chat", ChatEvents.userAdded)) {
		socketManager.addEventListener("chat", ChatEvents.userAdded, userAddedHandler);
	}
	if(!socketManager.hasEventListener("chat", ChatEvents.newChannelCreated)) {
	socketManager.addEventListener("chat", ChatEvents.newChannelCreated, newChannelCreatedHandler);
	}
	if(!socketManager.hasEventListener("chat", ChatEvents.channelDeleted)) {
	socketManager.addEventListener("chat", ChatEvents.channelDeleted, channelIdDeletedHandler);
	}
	if(!socketManager.hasEventListener("chat", ChatEvents.channelUpdated)) {
		socketManager.addEventListener("chat", ChatEvents.channelUpdated, channelUpdatedHandler);
	}
	if(!socketManager.hasEventListener("chat", ChatEvents.kicked)) {
		socketManager.addEventListener("chat", ChatEvents.kicked, KickedHandler);
	}
	if(!socketManager.hasEventListener("chat", ChatEvents.banned)) {
		socketManager.addEventListener("chat", ChatEvents.banned, bannedHandler);
	}
	$data.loadChannels(currentUser.id);
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