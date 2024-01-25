<template>
	<div class="header-channel">
		<div class="profile-img-div" >
			<img v-if="activeChannel?.mode === 'Private'" :src="channelImage" alt="Profile Picture">
		</div>
		<p>{{ channelName }}</p>
		<div class="logos-div">
			<div class="logo" @click="openEditChannelForm()" v-if="activeChannel && isAdmin && !isPrivate" title="Edit channel">
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
		<div class="logo" @click="opendAddUserForm()" v-if="activeChannel && !isPrivate" title="Add Users">
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
		<div class="logo" @click="leaveChannel()" v-if="activeChannel && !isPrivate" title="Leave channel">
			<svg viewBox="0 0 600 600" version="1.1" id="svg9724" sodipodi:docname="exit.svg" inkscape:version="1.2.2 (1:1.2.2+202212051550+b0a8486541)" width="64px" height="64px" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs id="defs9728"></defs> <sodipodi:namedview id="namedview9726" pagecolor="#ababab" bordercolor="#ababab" borderopacity="1.0" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#ababab" showgrid="true" inkscape:zoom="0.84118632" inkscape:cx="445.79898" inkscape:cy="283.52815" inkscape:window-width="1920" inkscape:window-height="1009" inkscape:window-x="0" inkscape:window-y="1080" inkscape:window-maximized="1" inkscape:current-layer="svg9724" showguides="true"> <inkscape:grid type="xygrid" id="grid9972" originx="0" originy="0"></inkscape:grid> <sodipodi:guide position="-260,300" orientation="0,-1" id="guide383" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="300,520" orientation="1,0" id="guide385" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="240,520" orientation="0,-1" id="guide939" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="220,80" orientation="0,-1" id="guide941" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="620,240" orientation="-0.70710678,-0.70710678" id="guide1075" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="450,190" orientation="0.70710678,-0.70710678" id="guide1077" inkscape:locked="false"></sodipodi:guide> </sodipodi:namedview> <path id="rect348" style="color:#ababab;fill:#ababab;stroke-linecap:round;stroke-linejoin:round;-inkscape-stroke:none;paint-order:stroke fill markers" d="M 130 0 C 58.672245 0 0 58.672245 0 130 L 0 470 C 0 541.32776 58.672245 600 130 600 L 301.57812 600 C 367.83331 600 423.13643 549.36696 430.67188 485 L 349.43555 485 C 343.32179 505.66026 324.7036 520 301.57812 520 L 130 520 C 101.60826 520 80 498.39174 80 470 L 80 130 C 80 101.60826 101.60826 80 130 80 L 301.57812 80 C 324.7036 80 343.32179 94.339739 349.43555 115 L 430.67188 115 C 423.13642 50.633038 367.83331 0 301.57812 0 L 130 0 z "></path> <path id="path1073" style="color:#ababab;fill:#ababab;stroke-linecap:round;-inkscape-stroke:none" d="m 476.86328,179.99911 a 40,40 0 0 0 -28.28516,11.71484 40,40 0 0 0 0,56.57032 l 11.71485,11.71484 H 163.72656 a 40,40 0 0 0 -40,40 40,40 0 0 0 40,40 h 296.56641 l -11.71485,11.71484 a 40,40 0 0 0 0,56.57032 40,40 0 0 0 56.57032,0 l 72.79101,-72.79102 A 40,40 0 0 0 600,299.99911 40,40 0 0 0 577.5293,264.09481 l -72.38086,-72.38086 a 40,40 0 0 0 -28.28516,-11.71484 z"></path> </g></svg>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
import { inject, computed, ref, watch } from 'vue';
import { type SocketManager } from "@/SocketManager";
import {ServerEvents, type User} from '@/utils'

const socketManager: SocketManager = inject('socketManager') as SocketManager;
const $data : any = inject('$data');
const store = $data.getStore();
const currentUser =ref<User>(await $data.getCurrentUser());
const listUsers =ref<User []>(await $data.getUsers());
const activeChannel = computed(() => store.activeChannel);
const isPrivate = computed(() => {
	if (activeChannel.value?.mode === 'Private') {
		return true;
	}
	return false;
});
const isAdmin = computed(async () => {
	if (!activeChannel.value) {
		return false;
	}
	const admins = await $data.getAdmins(activeChannel.value.id);
	if (activeChannel.value.creatorId === currentUser.value.id
		|| admins.find((admin: any) => admin.id === currentUser.value.id)) {
		return true;
	}
	return false;
});
const channelName = computed(() => {
	if (!activeChannel.value) {
		return '';
	} else if (activeChannel.value?.mode === 'Private') {
		const id1 = activeChannel.value.name.split('#')[1];
		const id2 = activeChannel.value.name.split('#')[2];
		if (parseInt(id1)  === currentUser.value.id) {
			return listUsers.value.find((user: any) => user.id === parseInt(id2))?.username;
		}
		return listUsers.value.find((user: any) => user.id === parseInt(id1))?.username;
	}
	return activeChannel.value.name;
});

const channelImage = computed(() => {
	if (activeChannel.value?.mode === 'Private') {
		const id1 = activeChannel.value.name.split('#')[1];
		const id2 = activeChannel.value.name.split('#')[2];
		let avatar : string | undefined = '';
		if (parseInt(id1) === currentUser.value.id) {
			avatar = listUsers.value.find((user: any) => user.id === parseInt(id2))?.avatar;
		} else {
			avatar = listUsers.value.find((user: any) => user.id === parseInt(id1))?.avatar;
		}
		const timestamp = Date.now();
		if (avatar?.includes(':3000/api/user/avatar/'))
			return `${avatar}?${timestamp}`;
		else
			return avatar;
	}
	return undefined;
});

socketManager.addEventListener("user", ServerEvents.dataChanged, async () => {
	listUsers.value = await $data.getUsers();
	currentUser.value = await $data.getCurrentUser();
});


const openEditChannelForm = () => {
	$data.openEditModalForm();
}

const opendAddUserForm = () => {
	$data.openAddUserModalForm();
}

const leaveChannel = () => {
	$data.openConfirmationLeavingModal();
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
  justify-items: center;
  background: transparent;
  border-bottom: 2px solid #fe019973;
  box-sizing: border-box;
}

.logos-div {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
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
  font-size: 3.5rem;
  margin: auto;
}

.profile-img-div {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
}
.profile-img-div img {
	object-fit: cover;
  	width: 100%;
  	height: 100%;
}
</style>