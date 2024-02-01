<script setup lang="ts">
	import NavigationBar from "@/components/navigationBar.vue";
	import Game from "./components/game.vue"
	import v_notify from "@/notify/components/notify.vue";
	import v_miniChat from "@/chat/components/miniChat/miniChat.vue";

</script>

<template>
	<div class="game body">
		<NavigationBar></NavigationBar>
		<Suspense><Game></Game></Suspense>
		<v_miniChat></v_miniChat>
		<v_notify></v_notify>
	</div>
</template>

<style>
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
</style>@/injectables/STF