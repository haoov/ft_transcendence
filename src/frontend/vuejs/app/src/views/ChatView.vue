<script setup lang="ts">
	import Chat from '@/components/chatComp/Chat.vue';
	import navigationBar from '@/components/navigationBar.vue';
	import gameNotification from '@/game/components/gameNotification.vue';
	import router from '@/router';
	import { ClientEvents, ServerEvents } from '@/utils';

</script>

<template>
	<div class="chat body">
		<navigationBar></navigationBar>
		<Chat></Chat>
	</div>
	<!-- <gameNotification
		:display="stf.getDisplayValue(ServerEvents.gameReady)"
		text="Ready to play!"
		v-on:decline="socket.emit(ClientEvents.gameForfeit)"
		v-on:accept="socket.emit('play'); router.push('/game');"
	></gameNotification> -->
</template>

<style scoped>
	.chat.body {
		height: 100%;
		background: linear-gradient(	to right,
																var(--c-black),
																var(--c-blue-dark),
																var(--c-black)	);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>