<template>
    <div :class="divClass" :title="channelName">
        <p v-if="props.channel?.mode !== 'Private'">{{ channelName }}</p>
		<img v-else :src='imgSrc'/>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';

const $data : any  = inject('$data');
const store = $data.getStore();
const activeChannel = computed(() => store.activeChannel);
const currentUser = await $data.getCurrentUser();
const listUsers = await $data.getUsers();
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

const imgSrc = computed(() => {
	if (props.channel?.mode === 'Private') {
		const id1 = props.channel.name.split('#')[1];
		const id2 = props.channel.name.split('#')[2];
		if (id1 === currentUser.id) {
			return listUsers.find((user: any) => user.id === parseInt(id2)).avatar;
		}
		return listUsers.find((user: any) => user.id === parseInt(id1)).avatar;
	}
	return null;
})
</script>

<style scoped>
.circle-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background-color: --c-surface;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 5px;
  border: 0.5px solid #fff;
}

.active {
  border: 2px solid #fff;
  box-shadow: 0 0 2.5px #fff, 0 0 5px #fff, 0 0 7.5px #fe019a;
}

p {
  color: #fe019a;
  font-size: 1rem;
  font-weight: bold;
  margin: 0;

}

img {
  max-width: 100%;
  max-height: 100%;
}
</style>