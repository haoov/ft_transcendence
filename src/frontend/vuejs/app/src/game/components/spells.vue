<script setup lang="ts">
	import { inject, type ComputedRef } from 'vue';
	import type GameSocket from '../gameSocket';

	defineProps<{spellsOn: boolean[]}>();
	const gameSocket: GameSocket = inject("gameSocket") as GameSocket;
	const spells: string[] = ["fire", "ice", "small", "big"];
</script>

<template>
	<div class="spells">
		<div class="spellBar">
			<div class="spellElem">
				<img
					v-if="spellsOn[0]"
					class="spellImg"
					v-on:click="gameSocket.useSpell(spells[0])"
					src="@/assets/images/fire.png">
			</div>
			<div class="spellElem">
				<img
					v-if="spellsOn[1]"
					class="spellImg"
					v-on:click="gameSocket.useSpell(spells[1])"
					src="@/assets/images/ice.jpg">
			</div>
			<div class="spellElem">
				<img
					v-if="spellsOn[2]"
					class="spellImg"
					v-on:click="gameSocket.useSpell(spells[2])"
					src="@/assets/images/small.png">
			</div>
			<div class="spellElem">
				<img
					v-if="spellsOn[3]"
					class="spellImg"
					v-on:click="gameSocket.useSpell(spells[3])"
					src="@/assets/images/big.png">
			</div>
		</div>
	</div>
</template>

<style scoped>
	.spells {
		align-self: flex-end;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 720px;
		height: 50px;
		border-radius: 5rem;
		background: linear-gradient(to right,var(--c-white),10%, transparent);
		padding: 0px 10px 0px 10px;
		margin-top: 5px;
		animation: slide 0.3s ease-in;
		overflow: hidden;
	}

	@keyframes slide {
		0% {
			width: 0%;
		}
		100% {
			width: 720px;
		}
	}

	.spellBar {
		display: flex;
	}

	.spellElem {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 1rem;
		box-shadow: 0 0 0 1px var(--c-grey);
		background-color: var(--c-black);
		margin: 0px 3px 0px 3px;
	}

	.spellImg {
		width: 40px;
		height: 40px;
		border-radius: 1rem;
		background-color: var(--c-white);
		cursor: pointer;
	}

	.spellImg:hover {
			box-shadow: 0 0 10px 0 var(--c-white);
		}

	.spellText {
		color: var(--c-black);
		font-weight: bold;
	}
</style>