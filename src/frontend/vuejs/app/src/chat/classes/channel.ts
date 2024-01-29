import { reactive } from "vue";
import { Message, type ChannelData } from "@/chat";
import type { User } from "@/utils";
import racketIcon from '@/assets/images/racket-50.png';

export class Channel {
	private readonly id: number;
	private name: string;
	private readonly mode: string;
	private readonly creatorId: number;
	private readonly users: User[];
	private readonly messages: Message[];

	constructor(data: ChannelData) {
		this.id = data.id;
		this.mode = data.mode;
		this.users = reactive(data.users);
		this.name = data.name;
		this.creatorId = data.creatorId;
		this.messages = reactive<any>([]);
		if (data.messages) {
			for (const message of data.messages) {
				this.messages.push(new Message(message));
			}
		}
	}

	getId(): number {
		return this.id;
	}

	getName(): string {
		return this.name;
	}

	setName(name: string) {
		this.name = name;
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

	setMessages(messages: Message[]) {
		this.messages.splice(0, this.messages.length);
		this.messages.push(...messages);
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
			if (otherUser)
				return otherUser.username;
		}
		return this.name;
	}

	setUsers(users: User[]) {
		this.users.splice(0, this.users.length);
		this.users.push(...users);
	}
}