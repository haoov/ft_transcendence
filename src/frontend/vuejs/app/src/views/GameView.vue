<script setup lang="ts">
	import NavigationBar from "@/components/navigationBar.vue";
	import Game from "../components/game.vue"
	import STF from "@/STF";
	import Notification from "@/components/notification.vue";
	import { ClientEvents, ServerEvents } from "@/utils";
	import { provide } from "vue";

	const stf = new STF();

	const socket = await stf.connectNewSocket();

	provide("stf", stf);
</script>

<template>
	<div class="game body">
		<NavigationBar></NavigationBar>
		<Suspense><Game></Game></Suspense>
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