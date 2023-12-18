<template>
    <div class="blockGame">
        <h1 class="pongTitle">PONG GAME</h1>
        <h3 v-if="!finished()" id="gameText">{{state}}</h3>
        <button v-if="!modeChosen" class="play_button" @click="emitMode('classic')">Classic</button>
        <button v-if="!modeChosen" class="play_button" @click="emitMode('super')">Super</button>
        <div class="gameDiv" id="canvaContainer">
            <Suspense><canvas id="gameCanva" ref="gameCanva" :width="canvaWidth" :height="canvaHeight"></canvas></Suspense>
        </div>
        <h2 id="result" v-if="finished()">Congrats to {{winner}} !<br> {{ p2_score }} vs. {{ p1_score }}</h2>
        <button v-if="finished()" class="play_button" @click="reloadPage()">Play again</button>
    </div>
</template>

<script setup lang=ts>
    import axios from "axios";
    import io from "socket.io-client";
    import { Socket} from "socket.io-client";
    import { game, ClientEvents, ServerEvents } from '../utils';
    import type { position } from '../utils';
    import {onMounted, ref } from "vue";
    import { onBeforeRouteLeave, type RouteLocationNormalized } from "vue-router";

    const socket = io("http://localhost:3000/game") as Socket;
    const gameCanva = ref<HTMLCanvasElement | null>(null);
    let canvaWidth = ref(0);
    let canvaHeight = ref(0);
    let state = ref("");
    let winner = ref("");
    let p1_score = ref(0);
    let p2_score = ref(0);
    let modeChosen = ref(0);

    axios.get("http://localhost:3000/api/user/me").then((response) => {
        socket.emit(ClientEvents.connected, response.data)
    })

    onMounted(() => {
        // checkDisconnect();
        checkWaiting();
        checkFinished();
        updatePosition();
        window.addEventListener("keypress", (event: KeyboardEvent) => {
            switch (event.key) {
                case "w" :
                    socket.emit("move", "up");
                    break;
                case "s" :
                    socket.emit("move", "down");
                    break;
                case "a" :
                    socket.emit("move", "left");
                    break;
                case "d" :
                    socket.emit("move", "right");
                    break;
                }
            });
    });

    onBeforeRouteLeave((to: RouteLocationNormalized, from: RouteLocationNormalized, next: () => void) => {
        socket.disconnect();
        next();
    })
    

    function emitMode(mode: string) {
        socket.emit("mode", mode);
        modeChosen.value = 1;
    }

    function updatePosition() {
        socket.on(ServerEvents.position, (data: position, p1: number, p2: number) => {
            state.value = "";
            canvaHeight.value = 480;
            canvaWidth.value = 640;
            const canva = gameCanva.value as HTMLCanvasElement;
            const context = canva.getContext("2d")! as CanvasRenderingContext2D;
            game.p1 = data.p1;
            game.p2 = data.p2;
            p1_score.value = p1;
            p2_score.value = p2;
            const score: string = p1.toString() + "   -   " + p2.toString();
            context.clearRect(0, 0, canva.width, canva.height);
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, canva.width, canva.width);
            context.fillStyle = "#000000";
            context.textAlign = "center";
            context.font = " Avenir";
            context.fillText(score, canva.width / 2, 20);
            context.fillStyle = "#0000FF";
            context.fillRect(game.p1.x, game.p1.y, 20, 20);
            context.fillStyle = "#FF0000";
            context.fillRect(game.p2.x, game.p2.y, 20, 20);
            });
    }
    
    // function  checkDisconnect() {
    //     socket.on(ServerEvents.disconnect, () => {
    //         state.value = "Your opponent is disconnected ! Please waith for them...";
    //         emptyCanva();
    //     });
    // }
    function  checkWaiting() {
        socket.on(ServerEvents.waiting, () => {
            state.value = "Waiting for a game...";
            emptyCanva();
        });
    }
    function  checkFinished() {
        socket.on(ServerEvents.finished, (win: string, p1: number, p2: number) => {
            state.value = "Finished";
            p1_score.value = p1;
            p2_score.value = p2;
            winner.value = win;
            emptyCanva();
        });
    }
    function emptyCanva() {
        canvaHeight.value = 0;
        canvaWidth.value = 0;
    }
    function reloadPage() {
        window.location.reload();
    }
    function finished(): boolean {
        return state.value === "Finished";
    };
</script>

<style>
	.pongTitle {
		margin: 50px;
	}

    .gameDiv {
		margin: 20px;
	}
    
    #gameText {
        color:white;
    }

    #result {
        margin: 20px;
        align-items: center;
        text-align: center;
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
        background-color: white;
        box-shadow:0 0 12px white;
        border:none;
        padding: 0;
        outline: none;
    }

    #canvaContainer {
        text-align: center;
    }

    .play_button {
		border: none;
		background-color: #fe019a;
		color: white;
		padding: 10px 12px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 18px;
		box-shadow:0 0 20px #fe019a;
		border-radius: 8px;
        margin: 10px;
	}
</style>@/utils/game