<template>
    <div class="BlockGame">
        <canvas ref="game" width="640" height="480" style="border: 1px solid black;"></canvas>
	<p>
		<button class="move" @click="move('right')">Right</button>
		<button class="move" @click="move('left')">Left</button>
		<button class="move" @click="move('up')">Up</button>
		<button class="move" @click="move('down')">Bottom</button>
	</p>
    </div>
</template>

<script lang="ts">
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
</script>

<style>
    .move {
        color: black;
    }
</style>