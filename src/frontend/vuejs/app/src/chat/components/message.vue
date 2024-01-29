<script setup lang="ts">
	import type { SocketManager } from '@/SocketManager';
	import { inject, onUpdated } from 'vue';
	import type { Message } from '../classes';

	const props = defineProps<{message: Message, index: number, length: number}>();
	const socketManager = inject('socketManager') as SocketManager;

	function affectSide(message: Message) {
		if (message.getSender().id == socketManager.getUser().id)
			return "right";
		return "left";
	}

	function affectClass(message: Message, index: number) {
		if (index < props.length - 1)
			return '';
		return affectSide(message);
	}

	onUpdated(() => {
		const end = document.getElementById('last') as HTMLElement;
		end.scrollIntoView({ behavior: 'smooth',  });
	});
</script>

<template>
	<div :class="`message-row ${affectSide(message)}`">
		<div :class="`message ${affectClass(message, index)}`">
			{{ message.getText() }}
		</div>
	</div>
</template>

<style scoped>
	.message-row {
		display: flex;
		width: 100%;
	}

	.message-row.right {
		justify-content: flex-end;
	}

	.message-row.left {
		justify-content: flex-start;
	}

	.message {
		position: relative;
		width: fit-content;
		max-width: 150px;
		padding: 5px;
		margin-bottom: 5px;
		border-radius: 1rem;
		text-align: left;
		background-color: var(--c-white);
		color: var(--c-black);
	}

	.message.left::before {
		content: "";
		position: absolute;
		width: 0px;
		height: 0px;
		bottom: -7px;
		left: 9px;
		border-top: 4px solid var(--c-white);
		border-bottom: 4px solid transparent;
		border-right: 4px solid transparent;
		border-left: 4px solid var(--c-white);
	}

	.message.right::before {
		content: "";
		position: absolute;
		width: 0px;
		height: 0px;
		bottom: -7px;
		right: 9px;
		border-top: 4px solid var(--c-white);
		border-bottom: 4px solid transparent;
		border-left: 4px solid transparent;
		border-right: 4px solid var(--c-white);
	}
</style>