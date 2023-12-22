import axios from "axios";
import io from "socket.io-client";

async function fetchUsers() : Promise<any> {
	return axios.get('http://localhost:3000/api/user').then((res) => { return res.data });
};

async function fetchMyUser() : Promise<any> {
	return  axios.get('http://localhost:3000/api/user/me').then((res) => { return res.data });
};

async function fetchChannels() : Promise<any> {
	return axios.get('http://localhost:3000/api/chat/channels').then((res) => { return res.data });
}

async function fetchMessages() : Promise<any> {
	return axios.get('http://localhost:3000/api/chat/messages').then((res) => { return res.data });
}

const socket = io('http://localhost:3000');

export default {
	getSocket() {
		return socket;
	},

	getUsers() : Object {
		return fetchUsers();
	},

	getCurrentUser() : Object {
		return fetchMyUser();
	},

	getChannels() : Object {
		return fetchChannels();
	},

	getRawMessages() : Promise<any[]> {
		return fetchMessages();
	},

};