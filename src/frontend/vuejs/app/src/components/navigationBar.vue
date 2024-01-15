<script setup lang="ts">
	import mainTitle from './mainTitle.vue';
	const pages = [
		{
			name: 'HOME',
			link: '/',
		},
		{
			name: 'GAME',
			link: '/game',
		},
		{
			name: 'CHAT',
			link: '/chat',
		},
		{
			name: 'SETTINGS',
			link: '/settings'
		}
	];
</script>

<template>
	<nav class="navBar">
		<div class="pages">
			<ul v-for="page in pages" class="inline">
				<RouterLink :to="page.link">
					<mainTitle class="page" :text='page.name'></mainTitle>
				</RouterLink>
			</ul>
		</div>
	</nav>
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