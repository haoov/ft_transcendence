<script setup lang="ts">
	import router from '@/router';
	import axios from 'axios';
	import { useRoute } from 'vue-router'; 

	const uri_log: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth/login`;
	const uri_home: string = `http://${import.meta.env.VITE_HOSTNAME}:3000`;
	let twofaValue: string;
	const route = useRoute();
	const isTwoFa = route.query['2fa'];

	async function send2fa() {
		const uri2fa: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth/2fa/authenticate`
		await axios.post(uri2fa, { "twofaCode": twofaValue })
		.then(() => {
			window.location.href = uri_home;
		})
		.catch(() => {
			// NOTIFICATION
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
			<input id="twofa_input" v-model="twofaValue" type="text" name="2FA Code" required size="6" />
		</div>
		<a class="auth text" @click="signIn">Sign in</a>
	</div>
	<div class="twofa">
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

	.bounc	#logo_42 {
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
	}e {
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