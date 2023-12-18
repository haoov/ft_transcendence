import { Socket } from "socket.io";
import { PlayerInterface } from "../interfaces"

export class Player {
	private _id: number;
	private _email: string;
	private _avatar: string;
	private _status: number;
	private _side: number;

	constructor(id: number, email: string, avatar: string, status?: number, side?: number){
		this._id = id;
		this._email = email;
		this._avatar = avatar;
		this._status = status;
		this._side = side;
	};

	public getId(): number {
		return this._id;
	}

	public getEmail(): string {
		return this._email;
	}
	public getAvatar(): string {
		return this._avatar;
	}
	public getStatus(): number {
		return this._status;
	}
	public getSide(): number {
		return this._side;
	}

	public setStatus(status: number) {
		this._status = status;
	}

	public setSide(side: number) {
		this._side = side;
	}


	public isPartOf(status: number, sockets: Socket[]): boolean {
		if (sockets.filter((socket) => socket.data.player._id === this._id && socket.data.player._status === status))
			return true;
		else
			return false;
	}

	public getPlayer(): PlayerInterface {
		return {
			id: this._id,
			email: this._email,
			avatar: this._avatar,
			status: this._status,
			side: this._side,
		}
	}
}