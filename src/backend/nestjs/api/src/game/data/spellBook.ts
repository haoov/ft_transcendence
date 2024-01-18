import { Ball } from "./ball";
import { Paddle } from "./paddle";

class SpellBook {
	private spells: Map<string, boolean>;

	constructor(type?: string) {
		this.spells = new Map<string, boolean>(
			[
				["fire", false],
				["ice", false],
				["small", false],
				["big", false],
			]
		);
	}

	getSpellsEnabled(): boolean[] {
		let spellsEnabled: boolean[] = [];
		this.spells.forEach((value) => {spellsEnabled.push(value)});
		return spellsEnabled;
	}

	getSpellsTypes(): string[] {
		let spellsTypes: string[] = [];
		this.spells.forEach((value, type) => {spellsTypes.push(type)});
		return spellsTypes;
	}

	spellEnabled(type: string): boolean {
		return this.spells.get(type);
	}

	useSpell(type: string, ball: Ball, paddle: Paddle) {
		switch (type) {
			case "ice":
				if (ball.effect != "none")
					break;
				ball.effect = type;
				ball.vecSpeed.x *= 0.8;
				ball.vecSpeed.y *= 0.8;
				this.disableSpell(type);
				break;
			case "fire":
				if (ball.effect != "none")
					break;
				ball.effect = type;
				ball.vecSpeed.x *= 1.5;
				ball.vecSpeed.y *= 1.5;
				this.disableSpell(type);
				break;
			case "big":
				if (paddle.effect != "none")
					break;
				paddle.effect = type;
				paddle.scale.y *= 2;
				paddle.height *= paddle.scale.y
				this.disableSpell(type);
				break;
			case "small":
				if (ball.effect != "none")
					break;
				ball.effect = type;
				ball.scale = {x: 0.5, y: 0.5, z: 0.5};
				this.disableSpell(type);
				break;
			default: break;
		}
	}

	autoUseSpells(ball: Ball, paddle: Paddle) {
		this.getSpellsTypes().forEach((type) => {
			if (this.spellEnabled(type))
				this.useSpell(type, ball, paddle);
		});
	}

	enableSpell(type: string): void {
		this.spells.set(type, true);
	}

	disableSpell(type: string): void {
		this.spells.set(type, false);
	}
}

export { SpellBook };