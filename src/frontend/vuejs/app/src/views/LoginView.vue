<script setup lang="ts">
	import mainTitle from '../components/mainTitle.vue'
	import auth from '../components/42auth.vue'
	import v_notify from '../notify/components/notify.vue'
</script>

<template>
	<div class="login body">
		<mainTitle class="login title" :text="'TRANSCENDENCE'"></mainTitle>
		<div class="login wrapper">
				<auth></auth>
		</div>
		<v_notify></v_notify>
	</div>
</template>

<style>
	.login.body {
		height: 100%;
		background: linear-gradient(to right,
			var(--c-black),
			var(--c-blue-dark),
			var(--c-black)	);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.login.wrapper {
		width: 300px;
		text-align: center;
	}

	.login.title {
		margin-top: 100px;
		margin-bottom: 70px;
		font-size: 300%;
	}
</style>