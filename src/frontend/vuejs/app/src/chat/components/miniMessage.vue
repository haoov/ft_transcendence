<script setup lang="ts">
	import type { SocketManager } from '@/SocketManager';
	import { inject } from 'vue';
	import type { Message } from '../classes';
	import type { User } from '@/utils';
	import moment from 'moment-timezone';

	const props = defineProps<{message: Message, index: number, length: number}>();
	const socketManager = inject('socketManager') as SocketManager;

	function isCurrentUser(user: User) {
		return user.id == socketManager.getUser().id;
	}

	function affectSide(message: Message) {
		if (isCurrentUser(message.getSender()))
			return "right";
		return "left";
	}

	function affectClass(message: Message, index: number) {
		if (index < props.length - 1) {
			if (isCurrentUser(message.getSender()))
				return "colored";
			else
				return '';
		}
		return affectSide(message);
	}

	function time(rawTime: string) {
		const timeFr = moment.tz(rawTime, 'Europe/Paris');
		return timeFr.format('HH:mm:ss');
	}
</script>

<template>
	<div :class="`message-row ${affectSide(message)}`">
		<div id="message-data">
				<span
					class="message-infos"
					v-if="!isCurrentUser(message.getSender())">
					{{ message.getSender().username }}
				</span>
				<div
					:class="`message ${affectClass(message, index)}`"
					:title="`at ${time(message.getTime())}`">
					{{ message.getText() }}
				</div>
		</div>
	</div>
</template>

<style scoped>
	.message-row {
		display: flex;
		align-items: flex-end;
		width: 100%;
	}

	.message-row.right {
		justify-content: flex-end;
	}

	.message-row.left {
		justify-content: flex-start;
	}

	#message-data {
		display: flex;
		flex-direction: column;
	}

	.message-infos {
		font-size: x-small;
		color: var(--c-grey);
		margin-left: 5px;
		margin-right: 5px;
	}

	.message {
		position: relative;
		width: fit-content;
		max-width: 150px;
		padding: 5px;
		margin-bottom: 3px;
		border-radius: 1rem;
		text-align: left;
		background-color: var(--c-white);
		color: var(--c-black);
		overflow-wrap: break-word;
		word-break: break-all;
	}

	.message.colored {
		background-color: var(--c-pink-3);
	}

	.message.right {
		background-color: var(--c-pink-3);
	}

	.message.left::before {
		content: "";
		position: absolute;
		width: 0px;
		height: 0px;
		bottom: -4px;
		left: 4px;
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
		bottom: -4px;
		right: 4px;
		border-top: 4px solid var(--c-pink-3);
		border-bottom: 4px solid transparent;
		border-left: 4px solid transparent;
		border-right: 4px solid var(--c-pink-3);
	}
</style>