<script setup lang="ts">
	import navigationBar from '@/components/navigationBar.vue';
	import v_chat from '@/chat/components/chat.vue';
	import v_notify from '@/notify/components/notify.vue';
</script>

<template>
	<div id="chat-body">
		<navigationBar></navigationBar>
		<v_chat></v_chat>
		<v_notify></v_notify>
	</div>
</template>

<style scoped>
	#chat-body {
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