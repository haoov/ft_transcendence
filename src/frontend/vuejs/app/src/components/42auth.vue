<script setup lang="ts">
	const uri: string = "http://localhost:3000/api/auth/login";
</script>

<template>
	<div class="auth">
		<a v-bind:href="uri">
			<img id="logo_42" src="@/assets/images/42_logo.svg">
			<p class="auth text">Sign in</p>
		</a>
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