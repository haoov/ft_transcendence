import axios from "axios";
import io from "socket.io-client";

async function fetchUsers() : Promise<any> {
	return axios.get('http://localhost:3000/api/user').then((res) => { return res.data });
};

async function fetchMyUser() : Promise<any> {
	return  axios.get('http://localhost:3000/api/user/me').then((res) => { return res.data });
};

const socket = io('http://localhost:3000');
// const myUser = fetchMyUser().then((res) => { return res.data as Object});
// const users = fetchUsers().then((res) => { return res.data as Object});

export default {
	getSocket() {
		return socket;
	},

	getUsers() : Object {
		return fetchUsers();
	},

	getMyUser() : Object {
		return fetchMyUser();
	}
};