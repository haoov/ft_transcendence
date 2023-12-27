import axios from "axios";
import io from "socket.io-client";
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

async function fetchUsers() : Promise<any> {
	return axios.get('http://localhost:3000/api/user').then((res) => { return res.data });
};

async function fetchCurrentUser() : Promise<any> {
	return  axios.get('http://localhost:3000/api/user/me').then((res) => { return res.data });
};

async function fetchChannels() : Promise<Channel[]> {
	return axios.get('http://localhost:3000/api/chat/channels').then((res) => { return res.data });
};

async function fetchChannelById(id: number) : Promise<Channel> {
	return axios.get(`http://localhost:3000/api/chat/channels/${id}`).then((res) => { return res.data });
}

async function fetchMessages() : Promise<Message[]> {
	return axios.get('http://localhost:3000/api/chat/messages').then((res) => { return res.data });
};

async function fetchMessagesByChannelId(id: number) : Promise<Message[]> {
	console.log('channel id =', id);
	return axios.get(`http://localhost:3000/api/chat/messages/${id}`).then((res) => { return res.data });
};

const socket = io('http://localhost:3000');
const store = reactive({
	channels: [] as Channel[],
	messages: [] as Message [],
	users: [] as User [],
	currentUser: null as User | null,
	isModalOpen: false,
	activeChannel: null as Channel | null,
});

export default {
	getSocket() {
		return socket;
	},

	getUsers() : Object {
		return fetchUsers();
	},

	getCurrentUser() : Object {
		return fetchCurrentUser();
	},

	getChannels() : Object {
		return fetchChannels();
	},

	getRawMessages() : Promise<any[]> {
		return fetchMessages();
	},

	getStore() : Object {
		return store;
	},

	loadChannels() {
		fetchChannels().then((channels) => {
			store.channels = channels.slice().reverse();
		});
	},

	addChannel(channel: Channel) {
		store.channels.unshift(channel)
	},

	setActiveChannel(channel: Channel) {
		store.activeChannel = channel;
		localStorage.setItem('lastActiveChannel', store.activeChannel.id.toString());
	},

	loadMessages() {
		fetchMessages().then((messages) => {
			store.messages = messages;
		});
	},

	loadMessagesByChannel(idChannel: number) {
		fetchMessagesByChannelId(idChannel).then((messages) => {
			store.messages = messages;
		});
	},

	addMessage(message: Message) {
		store.messages.push(message);
	},

	loadUsers() {
		fetchUsers().then((users) => {
			store.users = users;
		});
	},

	openModal() {
		store.isModalOpen = true;
	},

	closeModal() {
		store.isModalOpen = false;
	},
};