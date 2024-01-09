<template>
	<div class="header-channel">
		<div></div>
		<p>{{ channelName }}</p>
		<img
			src="@/assets/images/chat-svg/options-lines-svgrepo-com.svg"
			alt="Options Icon"
			@click="openEditChannelForm"
			>
	</div>
</template>

<script setup lang="ts">
import { inject, computed, ref, watch } from 'vue';

const $data : any = inject('$data');
const store = $data.getStore();
const activeChannel = computed(() => store.activeChannel);
let channelName = ref('');

watch(activeChannel, () => {
	channelName.value = activeChannel.value.name;
});

const openEditChannelForm = () => {
	$data.openEditModalForm();
}

</script>

<style scoped>
.header-channel {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-bottom: 2px solid #fe019973;
  box-sizing: border-box;
}

img {
  display: block;
  width: 2rem;
  height: auto;
  margin: auto;
}

p {
  color: #fe019a;
  background-size: 100%;
  font-size: 2rem;
  margin: auto;
}
</style>