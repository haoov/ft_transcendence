import axios from "axios";
import { Channel, Message } from "./classes";
import { reactive } from "vue";

class Chat {
	private readonly channels:  Channel[];
	private readonly activeChannels: Channel[];

	constructor() {
		this.channels = [];
		this.activeChannels = reactive<any>([]);
		this.loadChannels();
	}

	testChannels() {
		if (this.channels.length > 0) {
			this.addActiveChannel(this.channels[0]);
		}
	}

	getActiveChannels(): Channel[] {
		return this.activeChannels.slice(0, 5);
	}

	addActiveChannel(channel: Channel) {
		this.activeChannels.splice(0, 0, channel);
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
			const newChannel = new Channel(channel.id, channel.name, channel.mode, channel.creatorId);
			const messages = await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/messages/${channel.id}`)
			.then((response) => { return response.data });
			messages.forEach((message: any) => {
				const newMessageSend = new Message(	message.id, message.sender, message.message.text, message.message.time);
				newChannel.addMessage(newMessageSend);
			});
			this.channels.splice(0, 0, newChannel);
		});
	}

	getChannelById(id: number): Channel | undefined {
		return this.channels.find((channel) => channel.getId() == id);
	}
}

const chat = new Chat();

export default chat;