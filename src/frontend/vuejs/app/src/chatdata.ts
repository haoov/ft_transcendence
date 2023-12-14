import axios from "axios";
import io from "socket.io-client";

const socket = io('http://localhost:3000');

async function fetchUsers() : Promise<any> {
	return axios.get('http://localhost:3000/api/user').then((res) => { return res.data});
};

async function fetchMyUser() : Promise<any> {
	return  axios.get('http://localhost:3000/api/user/me').then((res) => { return res.data});
};

export default {
	getSocket() {
		return socket;
	},

	getUsers() : Promise<any> {
		return fetchUsers();
	},

	getMyUser() : Promise<any> {
		return fetchMyUser();
	}
};