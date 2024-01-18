<script setup lang="ts">
import router from '@/router';
import axios from 'axios';

	const uri: string = "http://localhost:3000/api/auth/login";
	let twofaValue: string;

	async function send2fa() {
		const uri2fa: string = "http://localhost:3000/api/auth/2fa/authentificate"
		const btn = document.getElementById("twofa_access_btn");
		await axios.post(uri2fa, { "twofaCode": twofaValue })
		.then(() => {
			btn!.style.backgroundColor = "green";
			router.push("/");
		})
		.catch(() => {
			btn!.classList.add("bounce");
			setTimeout(function() {
				btn!.classList.remove("bounce");
			}, 1000); 
		})
	}

	async function enable2fa() {
		const uri2fa: string = "http://localhost:3000/api/auth/2fa/turn-on"
		const btn = document.getElementById("twofa_enable_btn");
		await axios.post(uri2fa, { "twofaCode": twofaValue })
		.then(() => {
			btn!.style.backgroundColor = "green";
			router.push("/");
		})
		.catch(() => {
			btn!.classList.add("bounce");
			setTimeout(function() {
				btn!.classList.remove("bounce");
			}, 1000); 
		})
	}
	
	async function getqrcode2fa() {
		const uri2fa: string = "http://localhost:3000/api/auth/2fa/generate"
		const qrcode = document.getElementById("qrcode");
		await axios.get(uri2fa)
		.then((res) => {
			qrcode!.setAttribute("src", res.data)
		})
	}

	async function check2fa() {
		const uri2fa: string = "http://localhost:3000/api/auth/2fa"
		const btn = document.getElementById("twofa_check_btn");
		await axios.get(uri2fa)
		.then((res) => {
			console.log(res.data)
		})
	}
	
</script>

<template>
	<div class="twofa">
		<img id="logo_42" src="@/assets/images/42_logo.svg">
		<div id="twofa_form">
			<input id="twofa_input" v-model="twofaValue" type="text" name="2FA Code" required size="6" />
		</div>
		<div v-on:click="send2fa">
			<p class="twofa_btn" id="twofa_access_btn">Access Transcendence</p>
		</div>
	<div class="twofa">
		<div v-on:click="enable2fa">
			<p class="twofa_btn" id="twofa_qrcode_btn">Enable 2fa</p>
		</div>
		<div v-on:click="getqrcode2fa">
			<p class="twofa_btn" id="twofa_enable_btn">Get 2fa QRCode</p>
			<img id="qrcode">
		</div>
		<div v-on:click="check2fa">
			<p class="twofa_btn" id="twofa_check_btn">Check 2fa</p>
		</div>
	</div>
</div>
</template>

<style>
	#logo_42 {
		width: 70px;
	}

	.twofa {
		display: flex;
		justify-content: flex-start;
	    flex-direction: column;
    	flex-wrap: nowrap;
    	align-items: center;
		gap: 15px;
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
		border: 1px solid #00babc;
		font-size: 1.3em;
		padding: 8px 20px 5px 30px;
		text-align: center;
	}

	.twofa_btn {
		background-color: #00babc;
		cursor: pointer;
		height: 45px;
		display: table-cell;
		vertical-align: middle;
		font-size: 1rem;
		padding-left: 10px;
		padding-right: 10px;
	}

	.bounce {
		outline: 0;
		border-color: red;
		animation-name: bounce;
		animation-duration: .5s;
		animation-delay: 0.25s;
	}

	@keyframes bounce {
		0% {
			transform: translateX(0px);
			timing-function: ease-in;
			background-color: #00babc;
		}
		37% {
			transform: translateX(5px);
			timing-function: ease-out;
		}
		55% {
			transform: translateX(-5px);
			timing-function: ease-in;
			background-color: red;
		}
		73% {
			transform: translateX(4px);
			timing-function: ease-out;
		}
		82% {
			transform: translateX(-4px);
			timing-function: ease-in;
		}
		91% {
			transform: translateX(2px);
			timing-function: ease-out;
		}
		96% {
			transform: translateX(-2px);
			timing-function: ease-in;
		}
		100% {
			transform: translateX(0px);
			timing-function: ease-in;
			background-color: #00babc;
		}
	}

</style>