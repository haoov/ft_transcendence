<template>
	<div class="header-channel">
		<p>{{ channelName }}</p>
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

</script>

<style scoped>
.header-channel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
  border-bottom: 2px solid #fe019973;
  box-sizing: border-box;
}

/*Need to change that */
p {
  color: #fe019a;
  background-size: 100%;
  font-size: 2rem;
  margin: auto;
}
</style>