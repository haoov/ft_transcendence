<script setup lang="ts">
	import mainTitle from '../components/mainTitle.vue'
	import loginForm from '../components/loginForm.vue'
	import auth from '../components/42auth.vue'
</script>

<template>
	<div class="login body">
		<mainTitle class="login title"></mainTitle>
		<div class="login wrapper">
			<div class="login form">
				<loginForm></loginForm>
			</div>
			<div>
				<auth></auth>
			</div>
		</div>
	</div>
</template>

<style>
	.login.body {
		margin-top: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.login.wrapper {
		width: 300px;
		text-align: center;
	}

	.login.title {
		margin-bottom: 70px;
		font-size: 300%;
	}

</style>