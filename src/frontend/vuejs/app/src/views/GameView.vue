<script setup lang="ts">
</script>

<template>
	<div class="game body">
		<h1 class="gameTitle"> Game Page </h1>
		<RouterLink to="/pong"><button id="playButton">Play</button></RouterLink>
	</div>
</template>

<style>
	.gameTitle {
		margin: 50px;
	}

	.game.body {
		height: 100%;
		background: linear-gradient(	to right,
																var(--c-black),
																var(--c-blue-dark),
																var(--c-black)	);
		display: flex;
		flex-direction: column;
		align-items: center;

	}

	#playButton {
		border: none;
		background-color: #fe019a;
		color: white;
		padding: 10px 12px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 18px;
		box-shadow:0 0 20px #fe019a;
		border-radius: 8px;
	}

</style>