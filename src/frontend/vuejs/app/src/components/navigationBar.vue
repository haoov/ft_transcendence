<script setup lang="ts">
	import mainTitle from './mainTitle.vue';
</script>

<template>
	<div class="navBar">
		<div class="pages">
			<div class="inline">
				<RouterLink to="/"><mainTitle class="page" :text="'HOME'"></mainTitle></RouterLink>
			</div>
			<div class="inline">
				<RouterLink to="game"><mainTitle class="page" :text="'GAME'"></mainTitle></RouterLink>
			</div>
			<div class="inline">
				<mainTitle class="page" :text="'CHAT'"></mainTitle>
			</div>
			<div class="inline">
				<mainTitle class="page" :text="'PROFILE'"></mainTitle>
			</div>
		</div>
	</div>
</template>

<style>
	.navBar {
		background: transparent;
		display: flex;
		justify-content: center;
		margin: 20px;
	}

	.inline {
		display: inline-block;
		margin-left: 10px;
		margin-right: 10px;
	}

	.page {
		font-size: 110%;
	}

	.page:hover {
		color: var(--c-black);
	}
</style>