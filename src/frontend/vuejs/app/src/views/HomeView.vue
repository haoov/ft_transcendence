<script setup lang="ts">
	import Leaderboard from '@/components/leaderboard.vue';
import navigationBar from '@/components/navigationBar.vue';

	// import axios from "axios";
    // import io from "socket.io-client";
    // import { Socket} from "socket.io-client";
    // import {ClientEvents } from '../utils';


    // const socket = io("http://localhost:3000/connect") as Socket;

    // axios.get("http://localhost:3000/api/user/me").then((response) => {
    //     socket.emit(ClientEvents.connected, response.data)
    // })
</script>

<template>
	<navigationBar></navigationBar>
    <Leaderboard></Leaderboard>
</template>

<style>
</style>
