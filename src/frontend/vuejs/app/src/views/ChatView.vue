<script setup lang="ts">
	import Chat from '@/components/chatComp/Chat.vue';
	import navigationBar from '@/components/navigationBar.vue';
</script>

<template>
	<div class="chat body">
		<navigationBar></navigationBar>
		<Chat></Chat>
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