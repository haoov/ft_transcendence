<script setup lang="ts">
	import Chat from '@/components/chatComp/Chat.vue';
	import navigationBar from '@/components/navigationBar.vue';
	import Notification from '@/components/notification.vue';
	import STF from '@/STF';
	import router from '@/router';
	import { ClientEvents, ServerEvents } from '@/utils';

	const stf = new STF();
	const socket = await stf.connectNewSocket();
</script>

<template>
	<navigationBar></navigationBar>
	<Chat></Chat>
	<Notification
		:display="stf.getDisplayValue(ServerEvents.gameReady)"
		text="Ready to play!"
		v-on:decline="socket.emit(ClientEvents.gameForfeit)"
		v-on:accept="socket.emit('play'); router.push('/game');"
	></Notification>
</template>

<style scoped>
</style>@/injectables/STF