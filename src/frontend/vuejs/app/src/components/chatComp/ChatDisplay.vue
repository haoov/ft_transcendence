<template>
	<div class="chat-display-div">
		<ChatHeader></ChatHeader>
		<Suspense>
			<MessageDisplay></MessageDisplay>
		</Suspense>
		<Suspense>
			<InputBar></InputBar>
		</Suspense>
	</div>
</template>

<script setup lang="ts">
	import InputBar from './InputBar.vue';
	import MessageDisplay from './MessagesDisplay.vue';
	import ChatHeader from './ChatHeader.vue';
	import { ref, Suspense, onMounted } from 'vue';

	const end = ref<HTMLElement | null>(null);

	// onMounted(() => {
	// 	const chatDisplayDiv = document.querySelector('.chat-display-div');
	// 	if (chatDisplayDiv != null) {
	// 		chatDisplayDiv.scrollTo(end);
	// 	}
	// });

</script>

<style scoped>

.chat-display-div {
  display: grid;
  grid-template-rows: 1fr 6fr 0.5fr;
  align-content: stretch;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
/* Styles spécifiques à WebKit */
::-webkit-scrollbar {
  width: 6px; /* Ajustez la largeur de la scrollbar selon vos besoins */
}

::-webkit-scrollbar-thumb {
  background-color: transparent; /* Couleur transparente par défaut */
  border-radius: 8px; /* Arrondi des bords */
}

::-webkit-scrollbar-track {
  background-color: transparent; /* Couleur transparente par défaut */
}

/* Rendre la thumb visible lors du survol et de l'interaction */

::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: #fe019a;
  box-shadow:0 0 6px #fe019a; /*A voir si on garde*/
}

::-webkit-scrollbar-track:hover,
::-webkit-scrollbar-track:active {
  background-color: transparent; /* Couleur de la track lors du survol et de l'interaction */
}

</style>