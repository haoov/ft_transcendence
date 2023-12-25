import axios from "axios";
import io from "socket.io-client";
import { reactive } from "vue";

interface Channel {
	name: string;
	mode: string;
	creatorId: any;
};

async function fetchUsers() : Promise<any> {
	return axios.get('http://localhost:3000/api/user').then((res) => { return res.data });
};

async function fetchCurrentUser() : Promise<any> {
	return  axios.get('http://localhost:3000/api/user/me').then((res) => { return res.data });
};

async function fetchChannels() : Promise<any> {
	return axios.get('http://localhost:3000/api/chat/channels').then((res) => { return res.data });
}

async function fetchMessages() : Promise<any> {
	return axios.get('http://localhost:3000/api/chat/messages').then((res) => { return res.data });
}

const socket = io('http://localhost:3000');

const store = reactive({
	channels: [] as Channel[],
	isModalOpen: false,

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
			store.channels = channels;
		});
	},

	addChannel(channel: Channel) {
		store.channels.push(channel);
	},

	openModal() {
		store.isModalOpen = true;
	},

	closeModal() {
		store.isModalOpen = false;
	},
};