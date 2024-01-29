import axios, { type AxiosRequestConfig } from "axios";
import {
	Channel,
	Message,
	type ChannelParams,
	type ChatMenu,
	type MessageData,
	type MessageParams,
	type ChannelData
} from "@/chat";
import { reactive, ref, type Ref } from "vue";
import type { User } from "@/utils";

const apiChat: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat`;

class Chat {
	private readonly userChannels:  Channel[];
	private readonly activeChannels: Channel[];
	private chatMenu: Ref<ChatMenu>;

	constructor() {
		this.userChannels = reactive<any>([]);
		this.activeChannels = reactive<any>([]);
		this.chatMenu = ref("none");
	}

	addChannel(channel: Channel) {
		this.userChannels.push(channel);
		this.addActiveChannel(channel);
	}

	removeChannel(id: number) {
		const index = this.userChannels.findIndex(
			(channel) => channel.getId() == id
		);
		if (index != -1)
			this.userChannels.splice(index, 1);
	}

	getUserChannels(): Channel[] {
		return this.userChannels;
	}

	getActiveChannels(): Channel[] {
		return this.activeChannels.slice(0, 5);
	}

	getChannels(): Channel[] {
		return this.userChannels;
	}

	addActiveChannel(channel: Channel) {
		this.activeChannels.push(channel);
	}

	removeActiveChannel(id: number) {
		const index = this.activeChannels.findIndex(
			(channel) => channel.getId() == id
		);
		if (index != -1)
			this.activeChannels.splice(index, 1);
	};

	async loadChannels(userId: number) {
		const channels = await axios.get(`${apiChat}/channels`)
		.then((response) => { return response.data });
		console.log("[channels]", channels);
		channels.forEach((channel: ChannelData) => {
			const newChannel = new Channel(channel);
			this.userChannels.push(newChannel);
		});
	}

	getChannel(id: number): Channel | undefined {
		return this.userChannels.find((channel) => channel.getId() == id);
	}

	newMessage(data: MessageData) {
		const channel = this.getChannel(data.channelId);
		if (channel) {
			const newMessage = new Message(data);
			channel.addMessage(newMessage);
			if (!this.activeChannels.find((c) => c.getId() == channel.getId()))
				this.addActiveChannel(channel);
			const index: number = this.userChannels.findIndex((c) => c.getId() == channel.getId());
			if (index != -1 && index != 0) {
				this.userChannels.splice(index, 1);
				this.userChannels.splice(0, 0, channel);
			}
		}
	}

	sendMessage(params: MessageParams): void {
		if (params.text === "" || params.text.length > 512)
			return;
		const dateRawStamp : string = new Date().toISOString();
		params.datestamp = dateRawStamp;
		axios.post(`${apiChat}/message`, params);
	}

	getChatMenu(): Ref<ChatMenu> {
		return this.chatMenu;
	}

	setChatMenu(menu: ChatMenu): void {
		this.chatMenu.value = menu;
	}

	createChannel(params: ChannelParams): void {
		console.log("[creating channel]", params);
		axios.post(`${apiChat}/channel`, params);
	}

	updateChannel(channel: Channel, updatedParams: ChannelParams): void {
		if (updatedParams.name === "" || updatedParams.name.length > 32)
		updatedParams.mode = channel.getMode();
		updatedParams.creatorId = channel.getCreatorId();
		updatedParams.messages = channel.getMessages();
		updatedParams.users.push(...channel.getUsers());
		console.log("[updating channel]", updatedParams);
		axios.put(`${apiChat}/channel?id=${channel.getId()}`, updatedParams);
	}

	channelUpdate(data: ChannelData) {
		const index = this.userChannels.findIndex((c) => c.getId() == data.id);
		if (index != -1) {
			const updatedChannel = new Channel(data);
			updatedChannel.setMessages(this.userChannels[index].getMessages());
			this.userChannels.splice(index, 1, updatedChannel);
		} else {
			const newChannel = new Channel(data);
			this.userChannels.push(newChannel);
		}
	}

	async getAddableUsers(channel: Channel | undefined, user: User): Promise<User[]> {
		let response: AxiosRequestConfig<User[]>;
		if (channel) {
			response = await axios.get(`${apiChat}/channel/addable?id=${channel.getId()}&userId=${user.id}`);
		}
		else {
			response = await axios.get(`${apiChat}/channel/addable?userId=${user.id}`);
		}
		if (response.data)
			return response.data;
		else
			return [];
	}

	async getJoinableChannels(user: User): Promise<ChannelData[]> {
		const response = await axios.get(`${apiChat}/channels/joinable?id=${user.id}`);
		if (response.data)
			return response.data;
		else
			return [];
	}
}

const chat = new Chat();

export { chat };