<script setup lang="ts">
	import { socketManager } from '@/SocketManager';
	import gameData from '../gameData';

	function getSpells() {
		const username: string = socketManager.getUser().username;
		return gameData.getCurrentPlayer(username).value.spells;
	}

	const key: string[] = ["1", "2", "3", "4"];
</script>

<template>
	<div class="spells">
		<div class="spellBar">
			<div class="spellElem" v-for="spell in getSpells()">
				<span class="spellText"
				style="position: absolute; display: flex; align-items: center; color: var(--c-grey); z-index: 1;">
					{{ key[getSpells().findIndex((s) => spell.type == s.type)] }}
				</span>
				<img
					v-if="spell.on"
					class="spellImg"
					v-on:click="socketManager.useSpell(spell.type)"
					:src="spell.icon">
			</div>
		</div>
	</div>
</template>

<style scoped>
	.spells {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 66%;
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