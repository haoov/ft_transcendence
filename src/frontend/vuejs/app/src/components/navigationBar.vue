<script setup lang="ts">
	import mainTitle from './mainTitle.vue';
</script>

<template>
	<div class="navBar">
		<div class="pages">
			<div class="inline">
				<mainTitle class="page" :text="'HOME'"></mainTitle>
			</div>
			<div class="inline">
				<mainTitle class="page" :text="'GAME'"></mainTitle>
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