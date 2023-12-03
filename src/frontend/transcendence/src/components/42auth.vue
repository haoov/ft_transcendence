<template>
	<div class="auth">
		<RouterLink to="/">
			<img id="logo_42" src="@/assets/images/42_logo.svg">
			<p class="auth text">Sign in with 42</p>
		</RouterLink>
	</div>
</template>

<style>
	.auth {
		display: flex;
		justify-content: center;
	}

	#logo_42 {
		width: 40px;
	}

	.auth.text {
		background-color: #00babc;
		padding: 5px;
	}
</style>