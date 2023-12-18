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

type Message = {
	sender: {
		name: string;
		avatar: string;
	};
	message: {
		text: string;
		time: string;
	};
}

// function convertDataToMessage(data : Promise<any[]> ) : Message[] {
// 	const messages : Message[] = [];
// 	for (const message of data) {
// 		messages.push({
// 			sender: {
// 				name: message.username,
// 				avatar: message.avatar,
// 			},
// 			message: {
// 				text: message.messageText,
// 				time: message.timestamp,
// 			},
// 		});
// 	}
// 	return messages;
// }

export default {
	getSocket() {
		return socket;
	},

	getUsers() : Object {
		return fetchUsers();
	},

	getMyUser() : Object {
		return fetchMyUser();
	},

	getChannels() : Object {
		return fetchChannels();
	},

	getRawMessages() : Promise<any[]> {
		return fetchMessages();
	},

	// getMessages() : Message[] {
	// 	const data : Promise<any[]> = fetchMessages();
	// 	return convertDataToMessage(data);
	// },
};