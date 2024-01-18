<template>
    <div :class="divClass" :title="channelName">
        <p>{{ channelName }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';

const $data : any  = inject('$data');
const store = $data.getStore();
const activeChannel = computed(() => store.activeChannel);
const props = defineProps({
	channel: {
		type: Object,
	}
});

const divClass = computed( () => {
	if (activeChannel.value && props.channel?.id === activeChannel.value.id) {
		return 'circle-container active';
	} else {
		return 'circle-container';
	}
});

const channelName = ref(props.channel?.name);

</script>

<style scoped>
.circle-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #527a3f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 5px;
}

.active {
  border: 2px solid #fff;
  box-shadow: 0 0 2.5px #fff, 0 0 5px #fff, 0 0 7.5px #fe019a;
}

p {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  margin: 0;

}
</style>