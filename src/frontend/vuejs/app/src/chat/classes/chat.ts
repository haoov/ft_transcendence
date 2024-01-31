import axios, { type AxiosRequestConfig } from "axios";
import {
	Channel,
	Message,
	type ChannelParams,
	type ChatMenu,
	type MessageData,
	type ChannelData
} from "@/chat";
import { reactive, ref, type Ref } from "vue";
import type { User, UserRelation } from "@/utils";
import { ChatEvents } from "@/utils";
import { socketManager } from "@/SocketManager";
import notify from "@/notify/notify";

const apiChat: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat`;
const apiUser: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/user`;

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
		let index = this.userChannels.findIndex((channel) => channel.getId() == id);
		if (index != -1)
			this.userChannels.splice(index, 1);
		index = this.activeChannels.findIndex((channel) => channel.getId() == id);
		if (index != -1)
			this.activeChannels.splice(index, 1);
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
		const channels: ChannelData[] = await axios.get(`${apiChat}/channels`)
		.then((response) => { return response.data })
		.catch(() => {});
		channels.forEach((channel: ChannelData) => {
			const newChannel = new Channel(channel);
			this.userChannels.push(newChannel);
		})
	}

	async loadMessages(unblocked: number) {
		const channels = await axios.get(`${apiChat}/channels`)
		.then((response) => { return response.data })
		.catch(() => []);
		channels.forEach((channel: ChannelData) => {
			const newChannel = new Channel(channel);
			let index = this.userChannels.findIndex((c) => c.getId() == newChannel.getId());
			if (index != -1) {
				this.userChannels.splice(index, 1, newChannel);
			}
			index = this.activeChannels.findIndex((c) => c.getId() == newChannel.getId());
			if (index != -1) {
				this.activeChannels.splice(index, 1, newChannel);
			}
		})
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

	async sendPrivateMessage(user : User) : Promise<void> {
		const currentUser = socketManager.getUser();
		const ids = [currentUser.id.toString(), user.id.toString()];
		const sortedids = ids.sort();
		const channelName = '#' + sortedids.join('#');
		const index = this.userChannels.findIndex((c) => c.getName() == channelName);
		if (index != -1) {
			const [channel] = this.userChannels.splice(index, 1);
			this.userChannels.splice(0, 0, channel);
			return;
		} else {
			const userFinded : User = await axios.get(`${apiUser}?id=${user.id}`)
			.then((response) => { return response.data }).catch(() => {});
			const params: ChannelParams = {
				name: channelName,
				mode: "Private",
				creatorId: currentUser.id,
				messages: [],
				users: [currentUser, userFinded],
				admins: [currentUser]
			};
			this.createChannel(params);
		}
	}

	getChatMenu(): Ref<ChatMenu> {
		return this.chatMenu;
	}

	setChatMenu(menu: ChatMenu): void {
		this.chatMenu.value = menu;
	}

	async createChannel(params: ChannelParams): Promise<boolean> {
		return await axios.post(`${apiChat}/channel`, params)
		.then(() => true)
		.catch((err) => {
			notify.newNotification("error", {
				message: err.response.data.message
			});
			return false;
		});
	}

	async deleteChannel(channel: Channel): Promise<void> {
		await axios.delete(`${apiChat}/channel?id=${channel.getId()}`)
		.then(() => {
				this.removeChannel(channel.getId());
				notify.newNotification("success", {
					message: "Channel deleted",
					by: `${channel.getName()}`
				});
			})
			.catch((err) => {
				notify.newNotification("error", {
					message: err.response.data.message
				});
			
			})
	}

	async leaveChannel(channel: Channel): Promise<void> {
		await axios.delete(`${apiChat}/channel/leave?id=${channel.getId()}`)
		.then(() => {
				this.removeChannel(channel.getId());
			})
		.catch((err) => {
			console.log(err.response.data);
			notify.newNotification("error", {
				message: err.response.data.message
			});
		});
	}

	async updateChannel(channel: Channel, updatedParams: ChannelParams): Promise<void> {
		if (updatedParams.name === "" || updatedParams.name.length > 32)
			return;
		updatedParams.mode = channel.getMode();
		updatedParams.creatorId = channel.getCreatorId();
		updatedParams.messages = channel.getMessages();
		updatedParams.admins = channel.getAdmins();
		updatedParams.users.push(...channel.getUsers());
		await axios.put(`${apiChat}/channel?id=${channel.getId()}`, updatedParams)
		.catch((err) => {
			notify.newNotification("error", {
				message: err.response.data.message
			});
		});
	}

	joinChannel(channelId: number, user: User, password?: string) : void {
		socketManager.emit("chat", ChatEvents.joinChannel, { channelId: channelId, userId: user.id, password: password });
	}

	channelUpdate(data: ChannelData) {
		const index = this.userChannels.findIndex((c) => c.getId() == data.id);
		if (index != -1) {
			const updatedChannel = new Channel(data);
			this.userChannels.splice(index, 1, updatedChannel);
			updatedChannel.setMessages(this.userChannels[index].getMessages());
		} else {
			const newChannel = new Channel(data);
			this.userChannels.push(newChannel);
		}
	}

	async getAddableUsers(channel: Channel | undefined, user: User): Promise<User[]> {
		try {
			let response: AxiosRequestConfig<User[]>;
			if (channel) {
				response = await axios.get(`${apiChat}/channel/addable?id=${channel.getId()}&userId=${user.id}`);
			} else {
				response = await axios.get(`${apiChat}/channel/addable?userId=${user.id}`);
			}
			if (response.data)
				return response.data;
			else
				return [];
		}
		catch(err) {
			return [];
		}
	}

	async getJoinableChannels(user: User): Promise<ChannelData[]> {
		try {
			const response = await axios.get(`${apiChat}/channels/joinable?id=${user.id}`);
			if (response.data)
				return response.data;
			else
				return [];
		}
		catch(err) {
			return [];
		}
	}

	async getChannelRelations(channel: Channel): Promise<UserRelation[]> {
		try {
			const response = await axios.get(`${apiChat}/channel/relations?id=${channel.getId()}`);
			if (response.data)
				return response.data;
			else
				return [];
		}
		catch(err) {
			return [];
		}
	}

	updateUser(user: User) {
		this.userChannels.forEach((channel) => {
			const index = channel.getUsers().findIndex((u) => u.id == user.id);
			if (index != -1) {
				channel.getUsers().splice(index, 1, user);
			}
		});
		this.activeChannels.forEach((channel) => {
			const index = channel.getUsers().findIndex((u) => u.id == user.id);
			if (index != -1) {
				channel.getUsers().splice(index, 1, user);
			}
		});
	}

	removeMessages(blockedId: number) {
		this.userChannels.forEach((c) => {
			c.removeMessages(blockedId);
		})
	}
}

const chat = new Chat();

export { chat };