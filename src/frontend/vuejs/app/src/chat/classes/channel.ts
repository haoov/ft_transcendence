import { reactive } from "vue";
import { Message } from "./message";
import type { User } from "@/utils";
import racketIcon from '@/assets/images/racket-50.png';

export class Channel {
	private readonly id: number;
	private readonly name: string;
	private readonly mode: string;
	private readonly creatorId: number;
	private readonly users: User[];
	private readonly messages: Message[];

	constructor(id: number, name: string, mode: string, creatorId: number, users: User[]) {
		this.id = id;
		this.mode = mode;
		this.users = reactive(users);
		this.name = name;
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
		return this.messages.slice(-15);
	}

	getUsers(): User[] {
		return this.users;
	}

	addMessage(message: Message) {
		this.messages.push(message);
	}

	getIcon(currentUser: User) {
		if (this.mode == "Private") {
			const otherUser = this.users.find(
					user => user.username !== currentUser.username
			);
			return otherUser?.avatar;
		}
		return racketIcon;
	}

	getTitle(currentUser: User) {
		if (this.mode == "Private") {
			const otherUser = this.users.find(
					user => user.username !== currentUser.username
			);
			return otherUser?.username;
		}
		return this.name;
	}
}