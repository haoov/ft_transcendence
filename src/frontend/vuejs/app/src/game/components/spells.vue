<script setup lang="ts">
	import { inject } from 'vue';
	import type GameSocket from '../gameSocket';
	import { ClientEvents } from '@/utils';

	defineProps(["p1Spells", "p2Spells"]);
	const emit = defineEmits(["useSpell"]);
	const gameSocket: GameSocket = inject("gameSocket") as GameSocket;

	function useSpell(spell: string) {
		gameSocket.getSocket().emit(ClientEvents.useSpell, spell);
	}
</script>

<template>
	<div class="spells">
		<div class="spellBar p2">
			<div class="spellElem">
				<img v-if="p2Spells[0]" class="spellImg" v-on:click="useSpell('fire')" src="@/assets/images/fire.color.png">
			</div>
			<div class="spellElem">
				<img v-if="p2Spells[1]" class="spellImg" v-on:click="useSpell('ice')" src="@/assets/images/ice.color.jpg">
			</div>
			<div class="spellElem">
				<img v-if="p2Spells[2]" class="spellImg" v-on:click="useSpell('small')" src="@/assets/images/small.png">
			</div>
			<div class="spellElem">
				<img v-if="p2Spells[3]" class="spellImg" v-on:click="useSpell('big')" src="@/assets/images/big.png">
			</div>
		</div>
		<div class="spellBar p1">
			<div class="spellElem">
				<img v-if="p1Spells[0]" class="spellImg" v-on:click="useSpell('fire')" src="@/assets/images/fire.color.png">
			</div>
			<div class="spellElem">
				<img v-if="p1Spells[1]" class="spellImg" v-on:click="useSpell('ice')" src="@/assets/images/ice.color.jpg">
			</div>
			<div class="spellElem">
				<img v-if="p1Spells[2]" class="spellImg" v-on:click="useSpell('small')" src="@/assets/images/small.png">
			</div>
			<div class="spellElem">
				<img v-if="p1Spells[3]" class="spellImg" v-on:click="useSpell('big')" src="@/assets/images/big.png">
			</div>
		</div>
	</div>
</template>

<style scoped>
	.spells {
		align-self: flex-end;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 720px;
		height: 50px;
		border-radius: 5rem;
		background: linear-gradient(to right,var(--c-white),10%, transparent);
		padding: 0px 10px 0px 10px;
		margin-top: 5px;
		animation: slide 0.3s ease-in;
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
		.p1 {
			margin-right: 25px;
		}
		.p2 {
			margin-left: 25px;
		}
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