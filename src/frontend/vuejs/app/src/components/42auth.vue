<script setup lang="ts">
	import axios from 'axios';
	import { useRoute } from 'vue-router';
	import v_button from '@/components/custumButton.vue';
	import notify from '@/notify/notify';

	const uri_log: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth/login`;
	const uri_home: string = `http://${import.meta.env.VITE_HOSTNAME}:3000`;
	let twofaValue: string;
	const route = useRoute();
	const isTwoFa = route.query['2fa'];

	async function send2fa() {
		const uri2fa: string = "http://localhost:3000/api/auth/2fa/authenticate"
		await axios.post(uri2fa, { "twofaCode": twofaValue })
		.then(() => {
			window.location.href = uri_home;
		})
		.catch(() => {
			notify.newNotification("error", {message: "Wrong 2FA code"});
		})
	}

	function signIn() {
		if (isTwoFa == undefined) {
			window.location.href = uri_log;
		}
		else {
			send2fa();
		}
	}
	
</script>

<template>
	<div class="auth">
		<img id="logo_42" src="@/assets/images/42_logo.svg">
		<div v-if="isTwoFa" id="twofa_form">
			<input
				id="twofa_input"
				v-model="twofaValue"
				type="text"
				name="2FA Code"
				autocomplete="off"
			/>
		</div>
		<v_button id="signIn" @click="signIn()">Sign in</v_button>
	</div>
	<div class="twofa"></div>
</template>

<style>
	.auth {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
		gap: 10px;
	}

	#logo_42 {
		width: 70px;
	}

	#signIn {
		width: 100px;
		padding: 5px;
		font-size: 130%;
	}

	#twofa_form {
		display: flex;
		flex-direction: row;
		color: #00babc;
	}

	#twofa_input {
		width: 130px;
		height: 25px;
		background-color: #1e1e1e80;
		color: #fff;
		font-size: 1.3em;
		padding: 5px;
		text-align: center;
		border: 1px solid var(--c-white);
	}

	#twofa_input:focus {
		border: 1px solid var(--c-pink);
	}

	.bounc	#logo_42 {
		width: 70px;
	}
</style>