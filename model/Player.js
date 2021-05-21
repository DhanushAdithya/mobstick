class Player {
	players = []
	count = 2

	addUser(id, room) {
		let player = {
			id,
			room,
		}
		this.players.push(player)
		return player
	}

	//getUserList(room) {
	//let players = this.players.filter(player => player.room === room)
	//let playerNames = players.map(player => player.name)
	//return playerNames
	//}

	getUserId(room) {
		let players = this.players.filter(player => player.room === room)
		let playerId = players.map(player => player.id)
		return playerId
	}

	getUser(id) {
		return this.players.filter(player => player.id === id)[0]
	}

	removeUser(id) {
		let user = this.getUser(id)
		if (user) {
			this.players = this.players.filter(player => player.id !== id)
		}
		return user
	}

	roomCount(room) {
		let count = this.players.filter(player => player.room === room).length
		return count > this.count
	}
}

module.exports = {
	Player,
}
