<template>
	<div class="auth">
		<RouterLink to="/">
			<img id="logo_42" src="@/assets/images/42_logo.svg">
			<p class="auth text">Sign in</p>
		</RouterLink>
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