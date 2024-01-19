<script setup lang="ts">
	import notify from '../notify';
	import v_button from '../../components/custumButton.vue';

	const props = defineProps(["notification"]);
</script>

<template>
	<div id="notification">
		<span id="text">{{ notification.message }}</span>
		<div id="buttons-container">
			<v_button class="v_button" v-on:click="notify.removeNotification(notification.id)">Accept</v_button>
			<v_button class="v_button" v-on:click="notify.removeNotification(notification.id)">Decline</v_button>
		</div>
	</div>
</template>

<style scoped>
	#notification {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5px;
		background: var(--c-surface);
		border-radius: 0.8rem;
		box-shadow: 0 0 0 1px var(--c-black-light);
		margin-top: 10px;
		max-width: 250px;
	}

	#text {
		font-size: medium;
		padding: 5px;
	}

	.v_button {
		margin: 5px;
	}
</style>