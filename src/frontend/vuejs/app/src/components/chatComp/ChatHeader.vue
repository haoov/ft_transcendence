<template>
	<div class="header-channel">
		<div></div>
		<p>{{ channelName }}</p>
		<div class="logos-div">
			<div class="logo" @click="openEditChannelForm">
				<svg
				fill="#b8b7b7"
				height="64px"
				width="64px"
				version="1.1"
				id="Capa_1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 460.054 460.054"
				xml:space="preserve"
				stroke="#b8b7b7"
				>
				<g id="SVGRepo_bgCarrier" stroke-width="0"/>
				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
				<g id="SVGRepo_iconCarrier"> <g> <g> <path d="M40.003,69.679C17.914,69.679,0,87.592,0,109.697c0,22.089,17.914,39.987,40.003,39.987 c22.089,0,40.003-17.898,40.003-39.987C80.006,87.592,62.092,69.679,40.003,69.679z"/> </g> <g> <path d="M40.003,190.032C17.914,190.032,0,207.93,0,230.035c0,22.089,17.914,40.002,40.003,40.002 c22.089,0,40.003-17.913,40.003-40.002C80.006,207.93,62.092,190.032,40.003,190.032z"/> </g> <g> <path d="M40.003,310.37C17.914,310.37,0,328.283,0,350.372c0,22.089,17.914,40.003,40.003,40.003 c22.089,0,40.003-17.914,40.003-40.003C80.006,328.283,62.092,310.37,40.003,310.37z"/> </g> <g> <path d="M429.973,79.601H145.419c-16.611,0-30.081,13.47-30.081,30.096c0,16.612,13.469,30.081,30.081,30.081h284.554 c16.61,0,30.081-13.469,30.081-30.081C460.054,93.071,446.583,79.601,429.973,79.601z"/> </g> <g> <path d="M429.973,199.939H145.419c-16.611,0-30.081,13.469-30.081,30.096c0,16.612,13.469,30.081,30.081,30.081h284.554 c16.61,0,30.081-13.469,30.081-30.081C460.054,213.408,446.583,199.939,429.973,199.939z"/> </g> <g> <path d="M429.973,320.291H145.419c-16.611,0-30.081,13.469-30.081,30.081c0,16.611,13.469,30.08,30.081,30.08h284.554 c16.61,0,30.081-13.469,30.081-30.08C460.054,333.759,446.583,320.291,429.973,320.291z"/> </g> </g> </g>
			</svg>
		</div>
		<div class="logo" @click="opendAddUserForm">
			<svg
			width="64px"
			height="64px"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			stroke="#ffffff"
			>
			<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
			<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
			<g id="SVGRepo_iconCarrier"> <path fill="#a3a3a3" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"></path> </g>
			</svg>
		</div>
	</div>
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

const opendAddUserForm = () => {
	$data.openAddUserModalForm();
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

.logos-div {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.log {
  width:fit-content;
  height: fit-content;
}

svg {
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