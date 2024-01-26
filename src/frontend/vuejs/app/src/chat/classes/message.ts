import type { User } from "@/utils";

export class Message {
	private readonly id: number;
	private readonly sender: User;
	private readonly text: string;
	private readonly time: string;

	constructor(id: number, sender: User, text: string, time: string) {
		this.id = id;
		this.sender = sender;
		this.text = text;
		this.time = time;
	}

	getId(): number {
		return this.id;
	}

	getSender(): User {
		return this.sender;
	}

	getText(): string {
		return this.text;
	}

	getTime(): string {
		return this.time;
	}
}