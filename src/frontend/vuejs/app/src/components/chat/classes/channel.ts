import { reactive } from "vue";
import { Message } from "./message";
import { type User } from "@/utils";
import axios from "axios";

export class Channel {
	private readonly id: number;
	private name: string;
	private readonly mode: string;
	private readonly creatorId: number;
	private readonly password: string;
	private readonly messages: Message[];
	private readonly users: User[];
	private readonly bannedUsers: User[];
	private readonly admins: User[];

	constructor(id: number, name: string, mode: string, creatorId: number, password: string) {
		this.id = id;
		this.name = name;
		this.mode = mode;
		this.creatorId = creatorId;
		this.password = password;
		this.messages = reactive<any>([]);
		this.users = reactive<any>([]);
		this.bannedUsers = reactive<any>([]);
		this.admins = reactive<any>([]);
	}

	logAll() {
		console.log(`Channel id: ${this.id}`);
		console.log(`Channel name: ${this.name}`);
		console.log(`Channel mode: ${this.mode}`);
		console.log(`Channel creatorId: ${this.creatorId}`);
		console.log(`Channel password: ${this.password}`);
		console.log(`Channel messages: ${this.messages}`);
		console.log(`Channel users: ${this.users}`);
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
		return this.messages;
	}
	
	async loadMessages() {
		const messages = await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/messages/${this.id}`)
			.then((response) => { return response.data });
			messages.forEach((message: any) => {
				const newMessage = new Message(	message.id, message.sender, message.message.text, message.message.time);
				this.addMessage(newMessage);
			});
	}

	getUsers(): User[] {
		return this.users;
	}

	addMessage(message: Message) {
		this.messages.push(message);
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

	getBannedUsers(): User[] {
		return this.bannedUsers;
	}

	addBannedUser(user: User) {
		this.bannedUsers.push(user);
	}

	loadBannedUsers() {
		axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channels/banned?id=${this.id}`)
		.then((response) => { 
			response.data.forEach((user: any) => {
				this.addBannedUser(user);
			});
		});
	}

	getAdmins(): User[] {
		return this.admins;
	}

	addAdmin(user: User) {
		this.admins.push(user);
	}

	loadAdmins() {
		axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channels/admins?id=${this.id}`)
		.then((response) => { 
			response.data.forEach((user: any) => {
				this.addAdmin(user);
			});
		});
	}
}