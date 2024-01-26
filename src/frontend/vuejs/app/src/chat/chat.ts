import axios from "axios";
import { Channel, Message } from "./classes";
import { reactive } from "vue";
import type { User } from "@/utils";
import { call } from "three/examples/jsm/nodes/Nodes.js";

class Chat {
	private readonly userChannels:  Channel[];
	private readonly activeChannels: Channel[];
	private currentChannel: Channel | undefined;

	constructor() {
		this.userChannels = reactive<any>([]);
		this.activeChannels = reactive<any>([]);
		this.currentChannel = undefined;
		this.loadChannels();
	}

	addChannel(channel: Channel) {
		this.userChannels.push(channel);
		this.addActiveChannel(channel);
	}

	getCurrentChannel(): Channel | undefined {
		return this.currentChannel;
	}

	getUserChannels(): Channel[] {
		return this.userChannels;
	}

	getActiveChannels(): Channel[] {
		return this.activeChannels.slice(0, 5);
	}

	addActiveChannel(channel: Channel) {
		this.activeChannels.push(channel);
	}

	removeActiveChannel(id: number) {
		const index = this.activeChannels.findIndex((channel) => channel.getId() == id);
		if (index != -1)
			this.activeChannels.splice(index, 1);
	};

	async loadChannels() {
		const channels = await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channels`)
		.then((response) => { return response.data });
		channels.forEach(async (channel: any) => {
			const users: User[] = await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channel/users?id=${channel.id}`)
			.then((response) => { return response.data });
			const newChannel = new Channel(channel.id, channel.name, channel.mode, channel.creatorId, users);
			const messages = await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/messages/${channel.id}`)
			.then((response) => { return response.data });
			messages.forEach((message: any) => {
				const newMessage = new Message(	message.id, message.sender, message.message.text, message.message.time);
				newChannel.addMessage(newMessage);
			});
			this.userChannels.splice(0, 0, newChannel);
		});
	}

	getChannelById(id: number): Channel | undefined {
		return this.userChannels.find((channel) => channel.getId() == id);
	}

	newMessage(data: any) {
		const channel = this.getChannelById(data.message.channelId);
		if (channel) {
			const newMessage = new Message(data.message.id, data.sender, data.message.text, data.message.time);
			channel.addMessage(newMessage);
			if (!this.activeChannels.find((c) => c.getId() == channel.getId()))
				this.addActiveChannel(channel);
		}
	}

	sendMessage(message: string, channel: Channel, sender: User, callback: (message: any) => void) {
		if (message === "" || message.length > 512)
			return;
		const DateRawStamp : string = new Date().toISOString();
		const newMessage = {
		senderId: sender.id,
		channelId: channel.getId(),
		text: message,
		datestamp: DateRawStamp
		};
		callback(newMessage);
	}
}

const chat = new Chat();

export default chat;