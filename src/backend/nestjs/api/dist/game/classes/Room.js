"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const Pong_1 = require("../data/Pong");
const computer = { id: 0, username: "computer", status: "undefined", avatar: "", email: "", games_won: [], games_lost: [] };
class Room {
    constructor(name, params, p1, p2) {
        this.users = [];
        this.name = name;
        this.public = true;
        this.full = (params.mode == "singlePlayer" ? true : false);
        this.sockets = [];
        this.users.push(p1);
        if (p2)
            this.users.push(p2);
        this.params = params;
        this.game = new Pong_1.Pong(params);
    }
    startGame() {
        this.game.start();
    }
    getUsers() {
        return this.users;
    }
    addSocket(socket) {
        socket.data.room = this.name;
        this.sockets.push(socket);
        socket.join(this.name);
        if (socket.data.user.id != this.users[0].id) {
            this.users.push(socket.data.user);
            this.full = true;
        }
    }
    removeSocket(socket) {
        this.sockets.splice(this.sockets.indexOf(socket), 1);
        socket.leave(this.name);
    }
    getType() {
        return this.params.game;
    }
    getName() {
        return this.name;
    }
    isPublic() {
        return this.public;
    }
    isFull() {
        return this.full;
    }
    getSockets() {
        return this.sockets;
    }
    getWinner() {
        if (this.game.getPlayers()[0].score > this.game.getPlayers()[1].score)
            return this.users[0];
        else {
            if (this.users.length > 1)
                return this.users[1];
            else
                return computer;
        }
    }
    getLoser() {
        if (this.game.getPlayers()[0].score < this.game.getPlayers()[1].score)
            return this.users[0];
        else {
            return this.users[1];
        }
    }
    getScore(user) {
        if (this.users[0].id == user.id)
            return this.game.getPlayers()[0].score;
        else
            return this.game.getPlayers()[1].score;
    }
    getParams() {
        return this.params;
    }
    getGameUpdate() {
        return this.game.update();
    }
    gameMove(socket, direction) {
        const side = (socket.data.user.id == this.users[0].id ? "right" : "left");
        this.game.movePaddle(side, direction);
    }
    quitGame(socket) {
        if (socket.data.user.id == this.users[0].id)
            this.game.getPlayers()[1].topScore();
        else
            this.game.getPlayers()[0].topScore();
    }
    isOpen() {
        return (this.public && !this.full);
    }
    checkSockets(user) {
        if (this.sockets.find((socket) => { return (socket.data.user.id == user.id); }))
            return true;
        else
            return false;
    }
    getStats() {
        const stats = {
            game: this.params.game,
            winner: this.getWinner(),
            loser: this.getLoser(),
            winner_score: this.getScore(this.getWinner()),
            loser_score: this.getScore(this.getLoser()),
        };
        return stats;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map