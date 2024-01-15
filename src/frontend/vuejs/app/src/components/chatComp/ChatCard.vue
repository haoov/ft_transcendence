
<template>
	<div class="chat-display-card">
		<Suspense>
			<ChatNavbar></ChatNavbar>
		</Suspense>
		<Suspense>
			<ChatDisplay></ChatDisplay>
		</Suspense>
	</div>
</template>

<script setup lang="ts">
	import ChatDisplay from './ChatDisplay.vue';
	import ChatNavbar from './ChatNavbar.vue';
	import { Suspense } from 'vue';

</script>

<style scoped>
.chat-display-card {
  display: grid;
  grid-template-columns: 1fr 3fr;
  width: 70vh;
  height: 80vh;
  border-radius: 0.8rem;
  background: var(--surface);
  box-shadow: 0px 0px 0px 1px var(--c-black-light);
  overflow: auto;
}

</style>