import * as th from "three";
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

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
	p2PaddlePosition: Vec3,
	p2PaddleScale: Vec3,
	p2Effect: string,
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
	readonly cssRenderer: CSS2DRenderer;
	textureLoader;
	textures: textures;
	ball;
	paddle1;
	paddle2;
	field;
	effect;
	menu: CSS2DObject;
	playButoon;
	launch: boolean;
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

		this.cssRenderer = new CSS2DRenderer();
		this.cssRenderer.setSize(init.window.WIDTH, init.window.HEIGHT);
		this.cssRenderer.domElement.style.position = "absolute";
		this.container.appendChild(this.cssRenderer.domElement);

		//init textures
		this.textureLoader = new th.TextureLoader();
		this.textures = {
			tennisCourt: this.textureLoader.load("http://localhost:3000/api/game/textures?texture=tennisCourt"),
			questionMark: this.textureLoader.load("http://localhost:3000/api/game/textures?texture=questionMark"),
			ice: this.textureLoader.load("http://localhost:3000/api/game/textures?texture=ice"),
			fire: this.textureLoader.load("http://localhost:3000/api/game/textures?texture=fire"),
		}

		//init lights
		const ambiantLight = new th.AmbientLight(init.colors.WHITE, 0.5);
		const directionalLight = new th.DirectionalLight(init.colors.WHITE, 0.5);
		directionalLight.position.set(0, 0.5, 3);
		directionalLight.castShadow = true;
		this.scene.add(ambiantLight, directionalLight);

		//init menu
		this.menu = new CSS2DObject(document.createElement("div"));
		this.menu.element.id = "mainMenu";
		const classicButton = document.createElement("button");
		classicButton.className = "mainMenuButton";
		classicButton.textContent = "Classic Pong";
		const superButton = document.createElement("button");
		superButton.className = "mainMenuButton";
		superButton.textContent = "Super Pong";
		this.playButoon = document.createElement("button");
		this.playButoon.className = "mainMenuButton";
		this.playButoon.textContent = "Play";
		this.playButoon.onclick = () => {
			this.menu.element.removeChild(this.playButoon);
			this.menu.element.appendChild(classicButton);
			this.menu.element.appendChild(superButton);
		};
		//this.playButoon.onmouseup = () => {this.playButoon.style.backgroundColor = }
		this.menu.element.appendChild(this.playButoon);
		this.scene.add(this.menu);
		this.cssRenderer.render(this.scene, this.camera);

		//init objects
		this.ball = this.createBall(init.params.BALL_RADIUS);
		this.paddle1 = this.createPaddle(init);
		this.paddle2 = this.createPaddle(init);
		this.field = this.createField(init.params.FIELD_WIDTH, init.params.FIELD_HEIGHT);
		this.field.material.map = this.textures.tennisCourt;
		this.effect = this.createEffect();

		this.launch = false;
		this.started = false;
	};

	createBall(radius: number) {
		const ballGeometry = new th.SphereGeometry(radius, 100, 100);
		const ballMaterial = new th.MeshPhongMaterial();
		const ball = new th.Mesh(ballGeometry, ballMaterial);
		ball.castShadow = true;
		ball.receiveShadow = true;
		return ball;
	}

	createPaddle(init: initParams) {
		const paddleGeometry = new RoundedBoxGeometry(init.params.PADDLE_WIDTH,
																									init.params.PADDLE_HEIGHT,
																									init.params.PADDLE_DEPTH, 100);
		const paddleMaterial = new th.MeshPhongMaterial();
		const paddle = new th.Mesh(paddleGeometry, paddleMaterial);
		paddle.castShadow = true;
		paddle.receiveShadow = true;
		return paddle;
	}

	createField(width: number, height: number) {
		const geometry = new th.PlaneGeometry(width, height);
		const material = new th.MeshPhongMaterial();
		const field = new th.Mesh(geometry, material);
		field.position.set(0, 0, -1);
		field.receiveShadow = true;
		return field;
	}

	createEffect() {
		const geometry = new th.BoxGeometry(0.2, 0.2, 0.2, 100, 100, 100);
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
}