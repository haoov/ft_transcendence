import { reactive } from "vue";
import { Message } from "./message";
import { type User } from "@/utils";

export class Channel {
	private readonly id: number;
	private readonly name: string;
	private readonly mode: string;
	private readonly creatorId: number;
	private readonly password: string;
	private readonly messages: Message[];
	private readonly users: User[];

	constructor(id: number, name: string, mode: string, creatorId: number, password: string) {
		this.id = id;
		this.name = name;
		this.mode = mode;
		this.creatorId = creatorId;
		this.password = password;
		this.messages = reactive<any>([]);
		this.users = reactive<any>([]);
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

	getPassword(): string {
		return this.password;
	}

	getMessages(): Message[] {
		return this.messages.slice(0, 15);
	}

	getUser(): User[] {
		return this.users;
	}

	addMessage(message: Message) {
		this.messages.splice(0, 0, message);
	}

	addUser(user: User) {
		this.users.push(user);
	}

	removeUser(userToRemove: User) {
		const index = this.users.findIndex((user) => user.id == userToRemove.id);
		if (index >= 0)
			this.users.splice(index, 1);
	}

	getUsersId(): number [] {
		const UsersIds = this.users.map((user) => user.id);
		return UsersIds;
	}
}