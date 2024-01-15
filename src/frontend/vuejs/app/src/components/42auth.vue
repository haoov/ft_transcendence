<script setup lang="ts">
	import axios from 'axios';

	const uri: string = "http://localhost:3000/api/auth/login";
	const uri2fa: string = "http://localhost:3000/api/auth/2fa"

	async function check2fa() {
		axios.get(uri2fa)
			.then((res) => { console.log(res.data)})

	}
</script>

<template>
	<div class="auth">
		<a v-bind:href="uri">
			<img id="logo_42" src="@/assets/images/42_logo.svg">
			<p class="auth text">Sign in</p>
		</a>
		<button v-bind:onclick="check2fa">Check 2fa</button>
	</div>
</template>

<style>
	.auth {
		display: flex;
		justify-content: center;
	}

	#logo_42 {
		width: 70px;
	}

	.auth.text {
		width: 100px;
		background-color: #00babc;
		padding: 5px;
		font-size: 130%;
	}
</style>