import axios from "axios";
import { Channel } from "./channel";
import { Message } from "./message";
import { reactive, ref } from "vue";
import { socketManager } from "@/SocketManager";

class Chat {
	private readonly channels:  Channel[];
	private readonly activeChannels: Channel[];
	private currentChannel: Channel | undefined;

	constructor() {
		this.channels = reactive<any>([]);
		this.activeChannels = reactive<any>([]);
		this.currentChannel = undefined;
		this.loadChat();
	}

	logAll() {
		console.log("===============================");
		for (const channel of this.channels) {
			channel.logAll();
			console.log("===============================");
		}
	}

	getChannels(): Channel[] {
		return this.channels;
	}

	addChannel(channel: Channel) {
		this.channels.push(channel);
	}

	removeChannel(id: number) {
		const index = this.activeChannels.findIndex((channel) => channel.getId() == id);
		if (index != -1)
			this.channels.splice(index, 1);
	};

	async loadChat() {
		const channels = await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channels`)
		.then((response) => { return response.data });
		channels.forEach(async (channel: any) => {
			const newChannel = new Channel(channel.id, channel.name, channel.mode, channel.creatorId, channel.password);
			if (newChannel.getId() == this.currentChannel?.getId()) {
				const messages = await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/messages/${channel.id}`)
				.then((response) => { return response.data });
				messages.forEach((message: any) => {
					const newMessage = new Message(	message.id, message.sender, message.message.text, message.message.time);
					newChannel.addMessage(newMessage);
				});
			}
			const users = await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channel/users?id=${channel.id}`)
			.then((response) => { return response.data });
			users.forEach((user: any) => {
				newChannel.addUser(user);
			});
			this.channels.push(newChannel);
		});
	}

	getChannelById(id: number): Channel | undefined {
		return this.channels.find((channel) => channel.getId() == id);
	}

	getCurrentChannel(): Channel | undefined {
		return this.currentChannel;
	}
	
	setCurrentChannel(id: number) {
		console.log('==================================');
		console.log('[setCurrentChannel]', id);
		console.log('[setCurrentChannel]', this.channels);
		const currentChannel = this.channels?.find((channel)=> {
			return channel.getId() == id;
		});
		this.currentChannel = currentChannel ? currentChannel : undefined;
		console.log('[setCurrentChannel]', this.currentChannel);
		console.log('==================================');
	}
}

const chat = new Chat();

export default chat;