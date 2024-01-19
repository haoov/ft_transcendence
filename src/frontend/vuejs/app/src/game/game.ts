import * as th from "three";
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

interface Vec3 {
	x: number,
	y: number,
	z: number,
};

interface Material {
	color: number,
	colorMap?: string,
	normalMap?: string,
	displacementMap?: string
};

interface initParams {
	window: {
		WIDTH: number,
		HEIGHT: number,
	}
	cam: {
		FOV: number,
		ASPECT: number,
		NEARZ: number,
		FARZ: number,
		ZPOS: number,
	}
	params: {
		FIELD_WIDTH: number,
		FIELD_HEIGHT: number,
		PADDLE_WIDTH: number,
		PADDLE_HEIGHT: number,
		PADDLE_DEPTH: number,
		BALL_RADIUS: number,
	}
	colors: {
		WHITE: number,
	}
};

interface updatedParams {
	ballPosition: Vec3,
	ballScale: Vec3,
	ballEffect: string,
	p1PaddlePosition: Vec3,
	p1PaddleScale: Vec3,
	p1Effect: string,
	p1Spells: boolean[],
	p2PaddlePosition: Vec3,
	p2PaddleScale: Vec3,
	p2Effect: string,
	p2Spells: boolean[],
	effectPosition: Vec3,
	effectRotationSpeed: number,
	effectOn: boolean,
}

interface textures {
	tennisCourt: th.Texture,
	questionMark: th.Texture,
	ice: th.Texture,
	fire: th.Texture,
}

export class Game {
	/*------------------------------------*/
	/*              PROPERTIES            */
	/*------------------------------------*/
	readonly container: HTMLDivElement;
	readonly scene: th.Scene;
	readonly camera: th.PerspectiveCamera;
	readonly renderer: th.WebGLRenderer;
	textureLoader;
	textures: textures;
	ball;
	paddle1;
	paddle2;
	field: any;
	effect;
	started: boolean;

	/*------------------------------------*/
	/*      CONSTRUCTOR / INIT PHASE      */
	/*------------------------------------*/
	constructor(id: string, init: initParams) {
		//init scene camera and renderer
		this.container = document.getElementById(id) as HTMLDivElement;
		this.scene = new th.Scene();
		this.camera = new th.PerspectiveCamera(	init.cam.FOV, init.cam.ASPECT,
																						init.cam.NEARZ, init.cam.FARZ);
		this.camera.position.z = init.cam.ZPOS;
		this.renderer = new th.WebGLRenderer();
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = th.PCFSoftShadowMap;
		this.renderer.setSize(init.window.WIDTH, init.window.HEIGHT);
		this.container.appendChild(this.renderer.domElement);

		//init textures
		this.textureLoader = new th.TextureLoader();
		this.textures = {
			tennisCourt: this.textureLoader.load(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/game/textures?texture=tennisCourt`),
			questionMark: this.textureLoader.load(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/game/textures?texture=questionMark`),
			ice: this.textureLoader.load(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/game/textures?texture=ice`),
			fire: this.textureLoader.load(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/game/textures?texture=fire`),
		};

		//init lights
		const ambiantLight = new th.AmbientLight(init.colors.WHITE, 0.5);
		const directionalLight = new th.DirectionalLight(init.colors.WHITE, 0.5);
		directionalLight.position.set(0, 0.5, 3);
		directionalLight.castShadow = true;
		this.scene.add(ambiantLight, directionalLight);

		//init objects
		this.field = null;
		this.ball = this.createBall(init.params.BALL_RADIUS);
		this.paddle1 = this.createPaddle(init);
		this.paddle2 = this.createPaddle(init);
		this.effect = this.createEffect();

		this.scene.add(this.ball, this.paddle1, this.paddle2);

		this.started = false;
	};

	createBall(radius: number) {
		const ballGeometry = new th.SphereGeometry(radius, 10, 10);
		const ballMaterial = new th.MeshPhongMaterial();
		const ball = new th.Mesh(ballGeometry, ballMaterial);
		ball.castShadow = true;
		ball.receiveShadow = true;
		return ball;
	}

	createPaddle(init: initParams) {
		const paddleGeometry = new RoundedBoxGeometry(init.params.PADDLE_WIDTH,
																									init.params.PADDLE_HEIGHT,
																									init.params.PADDLE_DEPTH, 5);
		const paddleMaterial = new th.MeshPhongMaterial();
		const paddle = new th.Mesh(paddleGeometry, paddleMaterial);
		paddle.castShadow = true;
		paddle.receiveShadow = true;
		return paddle;
	}

	createField(width: number, height: number, mapOption: string) {
		const maps: string[] = ["space", "tennis", "classic"];
		let material;
		let map;

		//select random map if option is "random"
		if (mapOption == "random")
			map = maps[Math.floor(Math.random() * maps.length)];
		else
			map = mapOption;

		//create material according to map
		switch (map) {
			case "classic":
				material = new th.MeshPhongMaterial({color: 0x000000});
				break;
			case "tennis":
				material = new th.MeshPhongMaterial({
					map: this.textures.tennisCourt,
				});
				break;
			case "space":
				const spaceVideo = document.getElementById("video") as HTMLVideoElement;
				spaceVideo.play();
				const spaceTexture = new th.VideoTexture(spaceVideo);
				spaceTexture.minFilter = th.LinearFilter;
				spaceTexture.magFilter = th.LinearFilter;
				material = new th.MeshPhongMaterial({
					map: spaceTexture,
					side: th.FrontSide,
				});
				break;
		}

		//create field and 
		const geometry = new th.PlaneGeometry(width, height);
		const field = new th.Mesh(geometry, material);
		field.position.set(0, 0, -1);
		if (map != "space")
			field.receiveShadow = true;
		this.field = field;
		this.scene.add(this.field);
	}

	createEffect() {
		const geometry = new th.BoxGeometry(0.2, 0.2, 0.2, 5, 5, 5);
		const material = new th.MeshPhongMaterial();
		const effect = new th.Mesh(geometry, material);
		effect.material.map = this.textures.questionMark;
		effect.material.transparent = true;
		effect.material.opacity = 0.7;
		effect.castShadow = true;
		effect.receiveShadow = true;
		return effect;
	}

	/*------------------------------------*/
	/*           RUNNING PHASE            */
	/*------------------------------------*/
	hasStarted(): boolean {
		return (this.started);
	}

	update(data: updatedParams) {
		const newBallPos = new th.Vector3(	data.ballPosition.x,
																				data.ballPosition.y,
																				data.ballPosition.z);
		const newPaddle1Pos = new th.Vector3(	data.p1PaddlePosition.x,
																					data.p1PaddlePosition.y,
																					data.p1PaddlePosition.z);
		const newPaddle2Pos = new th.Vector3(	data.p2PaddlePosition.x,
																					data.p2PaddlePosition.y,
																					data.p2PaddlePosition.z);
		const newEffectPos = new th.Vector3(	data.effectPosition.x,
																					data.effectPosition.y,
																					data.effectPosition.z);

		this.ball.position.lerp(newBallPos, 1);
		this.ball.scale.set(data.ballScale.x, data.ballScale.y, data.ballScale.z);
		this.updateMaterial(this.ball, data.ballEffect);
		this.paddle1.position.lerp(newPaddle1Pos, 0.2);
		this.updateMaterial(this.paddle1, data.p1Effect);
		this.paddle1.scale.y = data.p1PaddleScale.y;
		this.paddle2.position.lerp(newPaddle2Pos, 0.2);
		this.paddle2.scale.y = data.p2PaddleScale.y;
		this.updateMaterial(this.paddle2, data.p2Effect);
		this.effect.position.lerp(newEffectPos, 0.2);
		this.effect.rotateX(data.effectRotationSpeed);
		this.effect.rotateY(data.effectRotationSpeed);
		this.effect.rotateZ(data.effectRotationSpeed);
		if (data.effectOn == false)
			this.scene.remove(this.effect);
		if (data.effectOn == true)
			this.scene.add(this.effect);
	}

	updateMaterial(obj: th.Mesh<th.BufferGeometry, th.MeshPhongMaterial>, texture: string) {
		switch (texture) {
			case "ice":
				obj.material.map = this.textures.ice;
				break;
			case "fire":
				obj.material.map = this.textures.fire;
				break;
			case "none":
				obj.material.map = null;
				break;
			default: break;
		}
		obj.material.needsUpdate = true;
	}

	stopGame() {
		this.started = false;
	}
}