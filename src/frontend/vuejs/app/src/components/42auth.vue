<script setup lang="ts">
	import axios from 'axios';

	const uri: string = "http://localhost:3000/api/auth/login";
	const uri2fa: string = "http://localhost:3000/api/auth/2fa"

	async function check2fa() {
		await axios.get(uri2fa)
			.catch(() => {
				console.log("connection with 2fa failed");
				return false; 
			})
			.then(() => {
				console.log("connection with 2fa successed");
				return true;
			})
		}
	
</script>

<template>
	<div class="auth">
		<a v-bind:href="uri">
			<img id="logo_42" src="@/assets/images/42_logo.svg">
			<p class="auth text">Sign in</p>
		</a>
	</div>
	<div v-if="check2fa" class="auth">
		<input class="input2fa" type="text" name="2FA Code" required size="6" />
		<button class="input2fa" v-bind:onclick="check2fa">Check 2fa</button>
	</div>
</template>

<style>
	.auth {
		display: flex;
		justify-content: flex-start;
	    flex-direction: column;
    	flex-wrap: nowrap;
    	align-items: center;
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

	.input2fa {
		color: black;
		width: 100px;
	}
</style>