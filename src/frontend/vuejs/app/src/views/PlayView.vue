<template>
    <div class="blockGame">
        <h1 class="pongTitle"> Welcome to Pong Game ! </h1>
        <div class="gameDiv" v-if="isStatus('playing')" id="canvaContainer">
            <canvas id="gameCanva" ref="gameCanva" width="640" height="480" style="border: 1px solid black;"></canvas>
            <p>
                <button class="move" @click="move('right')">Right</button>
                <button class="move" @click="move('left')">Left</button>
                <button class="move" @click="move('up')">Up</button>
                <button class="move" @click="move('down')">Bottom</button>
            </p>
        </div>
        <div class="gameDiv" v-else-if="isStatus('waiting')">
            <h3>Waiting for a game...</h3>
        </div>
        <div class="gameDiv" v-else-if="isStatus('alreadyWaiting')">
            <h3>You are already waiting !</h3>
        </div>
        <div class="gameDiv" v-else-if="isStatus('alreadyPlaying')">
            <h3>You are already playing !</h3>
        </div>
    </div>
</template>

<script setup lang=ts>
    import axios from "axios";
    import io from "socket.io-client";
    import { Socket} from "socket.io-client";
    import { game, ClientEvents, ServerEvents } from '../utils';
    import type { position } from '../utils';
    import { onMounted, ref } from "vue";
    const socket = io("http://localhost:3000/game") as Socket;
    const gameCanva = ref<HTMLCanvasElement | null>(null);
    let globalStatus = "";
    axios.get("http://localhost:3000/api/user/me").then((response) => {
        console.log(response.data);
        socket.emit(ClientEvents.connected, response.data)
    })

    onMounted(() => {
        checkAleadyWaiting();
        checkAlreadyPlaying();
        checkWaiting();
        //updatePosition();
    });
	
    function isStatus(status: string) : boolean {
        if (globalStatus === status)
            return true;
        else
            return false;
    }

    // function updatePosition() {
    //     globalStatus = "playing";
    //     const canva = gameCanva.value as HTMLCanvasElement;
    //     const context = canva.getContext("2d")! as CanvasRenderingContext2D;
    //     socket.on(ServerEvents.position, (data: position) => {
    //         game.p1 = data.p1;
    //         game.p2 = data.p2;
    //         context.clearRect(0, 0, canva.width, canva.height);
    //         context.fillStyle = "#FFFFFF";
    //         context.fillRect(0, 0, canva.width, canva.width);
    //         context.fillStyle = "#000000";
    //         context.fillRect(game.p1.x, game.p1.y, 20, 20);
    //         context.fillRect(game.p2.x, game.p2.y, 20, 20);
    //         });
    // }
    function  move(direction: string) {
		socket.emit("move", direction); }
    
    function  checkAlreadyPlaying() {
        socket.on(ServerEvents.alreadyPlaying, () => {
            globalStatus = "alreadyPlaying";
        });
    }
    function  checkAleadyWaiting() {
        socket.on(ServerEvents.alreadyWaiting, () => {
            globalStatus = "alreadyWaiting";
        });
    }
    function  checkWaiting() {
        socket.on(ServerEvents.waiting, () => {
            globalStatus = "waiting";
        });
    }
</script>

<style>
	.pongTitle {
		margin: 50px;
	}

    .gameDiv {
		margin: 20px;
	}

	.blockGame {
		height: 100%;
		background: linear-gradient(	to right,
																var(--c-black),
																var(--c-blue-dark),
																var(--c-black)	);
		display: flex;
		flex-direction: column;
		align-items: center;

	}

    #gameCanva {
        border-radius: 8px;
        border-color: white;
        background-color: white;
        box-shadow:0 0 12px white;
        border:none;
        padding: 0;
        outline: none;
    }

    #canvaContainer {
        text-align: center;
    }

	.move {
		border: none;
		background-color: #fe019a;
		color: white;
		padding: 5px 7px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 18px;
		box-shadow:0 0 10px #fe019a;
		border-radius: 8px;
        margin: 5px;
	}
</style>@/utils/game