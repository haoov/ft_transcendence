<script setup lang="ts">
	defineProps(["p1Spells", "p2Spells"]);
	const emit = defineEmits(["useSpell"]);

	function useSpell(spell: string) {
		emit("useSpell", spell);
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 720px;
		height: 50px;
		border-radius: 5rem;
		background: linear-gradient(145deg, var(--c-grey), transparent 35%);
		background-size: 200% 100%;
		padding: 0px 10px 0px 10px;
		margin-top: 2px;
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