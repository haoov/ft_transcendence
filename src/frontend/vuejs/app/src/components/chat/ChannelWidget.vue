<template>
    <div :class="divClass" :title="channelName">
        <p v-if="props.channel?.getMode() !== 'Private'">{{ channelName }}</p>
		<img v-else :src='imgSrc' alt="Profile Picture"/>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { Channel } from './classes/channel';
import { socketManager } from '@/SocketManager';
import type { User } from '@/utils';

const props = defineProps({
	channel: {
		type: Channel,
	},
	currentChannel:{
		type: Channel || null, 
	},
});
const currentUser = ref<User>(socketManager.getUser());
const currentChannel = props.currentChannel;
const channel = props.channel;
const channelName = computed(() => {
	if (!channel) return '';
	if (channel.getMode() === 'Private') {
		const id1 : number = parseInt(channel.getName().split('#')[1]);
		const id2 : number = parseInt(channel.getName().split('#')[2]);
		if(id1 == currentUser.value.id) {
			const userFind = channel.getUsers().find((user: User) => user.id === id2)
			return userFind?.username;
		}
		const userFind = channel.getUsers().find((user: User) => user.id === id1)
		return userFind?.username;
	} else if (channel.getName().length > 10) {
		return channel.getName().slice(0, 7) + "...";
	}
	return channel.getName();
});
const imgSrc = computed(() => {
	if (!channel) return undefined;
	if (channel.getMode() === 'Private') {
		const id1 : number = parseInt(channel.getName().split('#')[1]);
		const id2 : number = parseInt(channel.getName().split('#')[2]);
		if(id1 == currentUser.value.id) {
			const userFind = channel.getUsers().find((user: User) => user.id === id2)
			return userFind?.avatar;
		}
		const userFind = channel.getUsers().find((user: User) => user.id === id1)
		return userFind?.avatar;
	}
});
const divClass = computed(() => {
	if (channel?.getId() === currentChannel?.getId()) {
		return 'circle-container active';
	} else {
		return 'circle-container';
	}
});

// console.log('================CHANNEL WIDGET================');
// channel?.logAll();
// console.log(`Channel Name: ${channelName.value}`);
// console.log(`URL img: ${imgSrc.value}`);
// console.log(`DivClass: ${divClass.value}`);
// console.log('================CHANNEL WIDGET================');
// const $data : any  = inject('$data');
// const store = $data.getStore();
// const activeChannel = computed(() => store.activeChannel);
// const currentUser = await $data.getCurrentUser();
// const listUsers = await $data.getUsers();

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
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>