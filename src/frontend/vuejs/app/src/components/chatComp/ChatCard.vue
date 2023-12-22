
<template>
	<div class="chat-display-card">
		<Suspense>
			<ChatNavbar @update:Visibility="openNewChannelForm"></ChatNavbar>
		</Suspense>
		<ChatDisplay></ChatDisplay>
	</div>
</template>

<script setup lang="ts">
	import ChatDisplay from './ChatDisplay.vue';
	import ChatNavbar from './ChatNavbar.vue';

	const emit = defineEmits();
	const openNewChannelForm = () => {
		emit('update:Visibility', '');
	};
</script>

<style scoped>
.chat-display-card {
  display: grid;
  grid-template-columns: 1fr 3fr;
  width: 70vh;
  height: 80vh;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 10px #fe019a;
  animation: gradient 10s ease infinite;
}

</style>