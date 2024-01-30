import type { User } from "@/utils";
import type { MessageData } from "@/chat";

export class Message {
	private readonly id: number;
	private readonly sender: User;
	private readonly channelId: number;
	private readonly text: string;
	private readonly datestamp: string;

	constructor(data: MessageData) {
		this.id = data.id;
		this.channelId = data.channelId;
		this.sender = data.sender;
		this.text = data.text;
		this.datestamp = data.datestamp;
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

	getDatestamp(): string {
		return this.datestamp;
	}
}