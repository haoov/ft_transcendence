<script setup lang="ts">
	import Chat from '@/components/chat/Chat.vue';
	import navigationBar from '@/components/navigationBar.vue';
	import v_chat from '@/chat/components/chat.vue';
</script>

<template>
	<div class="chat body">
		<navigationBar></navigationBar>
		<Chat></Chat>
		<v_chat></v_chat>
	</div>
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