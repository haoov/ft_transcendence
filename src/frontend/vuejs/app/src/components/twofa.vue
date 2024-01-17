<script setup lang="ts">
	import axios from 'axios';

	const uri: string = "http://localhost:3000/api/auth/login";
	const uri2fa: string = "http://localhost:3000/api/auth/2fa/authentificate"
	let twofaValue: string;

	async function check2fa() {
		console.log(twofaValue);
		await axios.post(uri2fa, { "twofaCode": twofaValue })
		.then((res) => {
			console.log("nice \n" + res);
			window.location.href = uri;
		})
		.catch((res) => {
			console.log("error \n" + res);
		})
	}
	
</script>

<template>
	<div class="twofa">
		<input v-model="twofaValue" class="input2fa" type="text" name="2FA Code" required size="6" />
		<button class="input2fa" v-bind:onclick="check2fa">Send 2FA</button>
	</div>
</template>

<style>
	.twofa {
		display: flex;
		justify-content: flex-start;
	    flex-direction: column;
    	flex-wrap: nowrap;
    	align-items: center;
	}

	.twofa.text {
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