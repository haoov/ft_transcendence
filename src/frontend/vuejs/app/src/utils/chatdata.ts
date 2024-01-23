import axios from "axios";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { reactive } from "vue";

interface Channel {
	id: number;
	name: string;
	mode: string;
	creatorId: any;
};

interface Message {
	id: number;
	sender: {
		name: string;
		avatar: string;
	};
	message: {
		text: string;
		time: string;
	};
};

interface User {
	id : number,
	username: string,
	avatar: string;
	email: string,
};

async function fetchUsers() : Promise<User []> {
	return axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/all`).then((res) => { return res.data });
};

async function fetchUserById(id: number) : Promise<User> {
	return axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user?id=${id}`).then((res) => { return res.data });
}

async function fetchCurrentUser() : Promise<any> {
	return  axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((res) => { return res.data });
};

async function fetchChannels() : Promise<Channel[]> {
	return axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channels`).then((res) => { return res.data });
};

async function fetchJoinableChannels() : Promise<Channel[]> {
	return axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channels/joinable`).then((res) => { return res.data });
}

async function fetchCurrentUserChannels() : Promise<Channel []> {
	return axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/channels/`).then((res) => { return res.data });
}

async function fetchMessagesByChannelId(channelId: number) : Promise<Message[]> {
	return axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/messages/${channelId}`).then((res) => { return res.data });
};

async function fetchBlockedUsers() : Promise<User[]> {
	return axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/block`).then((res) => { return res.data });
}

async function fetchBlockersList() : Promise<number []> {
	return axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/blockedBy`).then((res) => { return res.data });
}

async function blockUser(id: number) {
	axios.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/chat/block?id=${id}`)
}

const store = reactive({
	isSocketReady: false,
	channels: [] as Channel[],
	messages: [] as Message [],
	users: [] as User [],
	userIdClicked: null as number | null,
	currentUser: null as User | null,
	isModalOpen: false,
	isEditModalOpen: false,
	isAddUserModalOpen: false,
	isconfirmationLeavingModalOpen: false,
	isProfileModalOpen: false,
	activeChannel: null as Channel | null,
	socket: io(`http://${import.meta.env.VITE_HOSTNAME}:3000/chat`),
});

export default {
	isSocketReady() : boolean {
		return store.isSocketReady;
	},

	initSocket() {
		this.getCurrentUser().then((user) => {
			store.socket.emit('userConnected', user);
		});
		store.isSocketReady = true;
	},
	
	getUsers() : Promise<User []> {
		return fetchUsers();
	},

	getUserById(id: number) : Promise<User> {
		return fetchUserById(id);
	},

	getBlockedUsers() : Promise<User[]> {
		return fetchBlockedUsers();
	},

	getBlockersList() : Promise<number []> {
		return fetchBlockersList();
	},

	blockUser(id: number) {
		return blockUser(id);
	},

	getCurrentUser() : Promise<User> {
		return fetchCurrentUser();
	},

	getChannels() : Object {
		return fetchChannels();
	},

	getJoinableChannels(id: number) : Object {
		return fetchJoinableChannels();
	},

	getStore() : Object {
		return store;
	},


	loadChannels() {
		fetchCurrentUserChannels().then((channels) => {
			store.channels = channels.slice().reverse();
		});
	},

	addChannel(channel: Channel) {
		store.channels.unshift(channel)
	},

	deleteChannel(channelId: number) {
		const index = store.channels.findIndex((c) => c.id === channelId);
		store.channels.splice(index, 1);
	},

	updateChannel(channel: Channel) {
		const index = store.channels.findIndex((c) => c.id === channel.id);
		store.channels[index] = channel;
	},

	setActiveChannel(channel: Channel) {
		store.activeChannel = channel;
	},

	loadMessagesByChannel(idChannel: number) {
		fetchMessagesByChannelId(idChannel).then((messages) => {
			store.messages = messages;
		});
	},

	addMessage(message: Message) {
		store.messages.push(message);
	},

	async sendDirectMessage(userId : number) {
		const user = await this.getUserById(userId);
		const currentUser = await this.getCurrentUser();
		const userIds : Array<number> = Array(userId, currentUser.id);
		const currentPrivateChannels = store.channels.filter((channel: any) => channel.mode === 'Private');
		const name = '#' + userIds.sort((a,b) => a -b).join('#');
		if (currentPrivateChannels.some((channel: any) => channel.name === name)) {
			const newActiveChannel = currentPrivateChannels.find((channel: any) => channel.name === name);
			if (newActiveChannel) {
				this.setActiveChannel(newActiveChannel);
			}
			this.closeModalForm();
		} else {
			const newChannel = {
				name: name,
				mode: 'Private',
				creatorId: currentUser.id,
				password: "",
				users: userIds,
			};
			store.socket.emit('createNewChannel', newChannel);
		}
		this.closeModalForm();
	},

	loadUsers() {
		fetchUsers().then((users) => {
			store.users = users;
		});
	},

	openModalForm() {
		store.isModalOpen = true;
	},

	closeModalForm() {
		store.isModalOpen = false;
	},

	openEditModalForm() {
		store.isEditModalOpen = true;
	},

	closeEditModalForm() {
		store.isEditModalOpen = false;
	},

	openAddUserModalForm() {
		store.isAddUserModalOpen = true;
	},

	closeAddUserModalForm() {
		store.isAddUserModalOpen = false;
	},

	openConfirmationLeavingModal() {
		store.isconfirmationLeavingModalOpen = true;
	},

	closeConfirmationLeavingModal() {
		store.isconfirmationLeavingModalOpen = false;
	},

	openProfileModal(id : number) {
		store.userIdClicked = id;
		store.isProfileModalOpen = true;
	},

	closeProfileModal() {
		store.isProfileModalOpen = false;
	},
};