<template>
    <div class="blockGame">
        <h1 class="pongTitle"> Welcome to Pong Game ! </h1>
        <div id="canvaContainer">
            <canvas id="gameCanva" ref="gameCanva" width="640" height="480" style="border: 1px solid black;"></canvas>
            <p>
                <button class="move" @click="move('right')">Right</button>
                <button class="move" @click="move('left')">Left</button>
                <button class="move" @click="move('up')">Up</button>
                <button class="move" @click="move('down')">Bottom</button>
            </p>
        </div>
    </div>
</template>

<!-- <script lang="ts">
    import axios from "axios";
    import io from "socket.io-client";
    import { Socket} from "socket.io-client";
    export default {
        name: 'BlockGame',
        data() {
            return {
                socket: {} as Socket,
                context: {} as CanvasRenderingContext2D,
                position: {
                    p1: {
                        x: 0,
                        y: 0
                    },
                    p2: {
                        x: 0,
                        y: 0
                    },
                }
            }
        },
        created() { 
			this.socket = io("http://localhost:3000/game")
            axios.get("http://localhost:3000/api/user/me").then((response) => {
                console.log(response.data);
                this.socket.emit("connected", response.data)
            })
		},
        mounted() {
            let canva = this.$refs.game as HTMLCanvasElement;
            this.context = canva.getContext("2d")!;
			this.socket.on("position", (data: {p1: {x: number; y: number}, p2: {x: number; y: number}}) => {
                this.position = data;
                this.context.clearRect(0, 0, canva.width, canva.height);
                this.context.fillStyle = "#FFFFFF";
                this.context.fillRect(0, 0, canva.width, canva.width);
                this.context.fillStyle = "#000000";
                this.context.fillRect(this.position.p1.x, this.position.p1.y, 20, 20);
                this.context.fillRect(this.position.p2.x, this.position.p2.y, 20, 20);
    });
        },
        methods: { 
			move(direction: string) {
				this.socket.emit("move", direction);
			}
		}
    }
    </script> -->

<script setup lang=ts>
    import axios from "axios";
    import io from "socket.io-client";
    import { Socket} from "socket.io-client";
    import { onMounted, ref } from "vue";
    const socket = io("http://localhost:3000/game") as Socket;
    const gameCanva = ref<HTMLCanvasElement | null>(null);
    var position = {
                p1: {
                    x: 0,
                    y: 0
                },
                p2: {
                    x: 0,
                    y: 0
                },
            } 
    axios.get("http://localhost:3000/api/user/me").then((response) => {
        console.log(response.data);
        socket.emit("connected", response.data)
    })

    onMounted(() => {
            updatePosition();
        });
	
    function updatePosition() {
        const canva = gameCanva.value as HTMLCanvasElement;
        const context = canva.getContext("2d")! as CanvasRenderingContext2D;
        socket.on("position", (data: {p1: {x: number; y: number}, p2: {x: number; y: number}}) => {
            position = data;
            context.clearRect(0, 0, canva.width, canva.height);
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, canva.width, canva.width);
            context.fillStyle = "#000000";
            context.fillRect(position.p1.x, position.p1.y, 20, 20);
            context.fillRect(position.p2.x, position.p2.y, 20, 20);
            });
    }
    function  move(direction: string) {
		socket.emit("move", direction); }
</script>

<style>
	.pongTitle {
		margin: 50px;
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