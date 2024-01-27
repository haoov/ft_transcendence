import { reactive } from "vue";
import { Message } from "./message";

export class Channel {
	private readonly id: number;
	private readonly name: string;
	private readonly mode: string;
	private readonly creatorId: number;
	private readonly messages: Message[];

	constructor(id: number, name: string, mode: string, creatorId: number) {
		this.id = id;
		this.name = name;
		this.mode = mode;
		this.creatorId = creatorId;
		this.messages = reactive<any>([]);
	}

	getId(): number {
		return this.id;
	}

	getName(): string {
		return this.name;
	}

	getMode(): string {
		return this.mode;
	}

	getCreatorId(): number {
		return this.creatorId;
	}

	getMessages(): Message[] {
		return this.messages.slice(0, 15);
	}

	addMessage(message: Message) {
		this.messages.splice(0, 0, message);
	}
}