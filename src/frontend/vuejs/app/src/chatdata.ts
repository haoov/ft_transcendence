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

async function fetchUsers() : Promise<User []> {
	return axios.get('http://localhost:3000/api/user').then((res) => { return res.data });
};

async function fetchCurrentUser() : Promise<any> {
	return  axios.get('http://localhost:3000/api/user/me').then((res) => { return res.data });
};

async function fetchChannels() : Promise<Channel[]> {
	return axios.get('http://localhost:3000/api/chat/channels').then((res) => { return res.data });
};

async function fetchCurrentUserChannels(id: number) : Promise<Channel []> {
	return axios.get(`http://localhost:3000/api/chat/channels/${id}`).then((res) => { return res.data });
}

async function fetchMessagesByChannelId(id: number) : Promise<Message[]> {
	return axios.get(`http://localhost:3000/api/chat/messages/${id}`).then((res) => { return res.data });
};

const socket = io('http://localhost:3000/chat');
socket.on('NewConnection', async () => {
	const user = await fetchCurrentUser();
	socket.emit('userConnected', user);
});

const store = reactive({
	channels: [] as Channel[],
	messages: [] as Message [],
	users: [] as User [],
	currentUser: null as User | null,
	isModalOpen: false,
	isEditModalOpen: false,
	activeChannel: null as Channel | null,
});

export default {
	getSocket() {
		return socket;
	},

	getUsers() : Promise<User []> {
		return fetchUsers();
	},

	getCurrentUser() : Object {
		return fetchCurrentUser();
	},

	getChannels() : Object {
		return fetchChannels();
	},

	getStore() : Object {
		return store;
	},

	loadChannels(idUser: number) {
		fetchCurrentUserChannels(idUser).then((channels) => {
			store.channels = channels.slice().reverse();
		});
	},

	addChannel(channel: Channel) {
		store.channels.unshift(channel)
	},

	setActiveChannel(channel: Channel) {
		store.activeChannel = channel;
		// localStorage.setItem('lastActiveChannel', store.activeChannel.id.toString()); // Permet de stocker la dernier channel active dans le local storage
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

};