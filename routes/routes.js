const { Router } = require('express')

const { Player } = require('../model/Player')
const router = Router()

const player = new Player()

const desktop_id = (req, res) => {
	const { id } = req.params
	const io = req.app.get('io')

	res.render('desktop')

	io.on('connection', socket => {
		console.log('Desktop:', socket.id, id)

		socket.on('join', roomId => {
			socket.join(roomId)

			player.removeUser(socket.id)
			player.addUser(socket.id, roomId)

			//if (Number(player.count) === player.getUserList(params.room).length) {
			//io.to(params.room).emit('playersReady', true)
			//}

			if (player.roomCount(roomId)) {
				io.to(socket.id).emit('leave the room')
			}

			socket.on('disconnect', () => {
				console.log(`User with id ${socket.id} disconnected`)
				player.removeUser(socket.id)
			})
		})
	})
}

const desktop_get = (req, res) => {
	res.render('index')
}

const phone_id = (req, res) => {
	const { id } = req.params
	const io = req.app.get('io')

	console.log(io.sockets.adapter.rooms)
	io.on('connection', socket => {
		console.log('Phone:', socket.id, id)

		socket.on('join', roomId => {
			socket.join(roomId)

			player.removeUser(socket.id)
			player.addUser(socket.id, roomId)

			//if (Number(player.count) === player.getUserList(params.room).length) {
			//io.to(params.room).emit('playersReady', true)
			//}

			if (player.roomCount(roomId)) {
				io.to(socket.id).emit('leave the room')
			}

			socket.on('start', roomId => {
				io.to(roomId).emit('start')
			})
			socket.on('reset', roomId => {
				io.to(roomId).emit('reset')
			})
			socket.on('orientation', e => {
				io.to(e[0]).emit('mobile orientation', e[1])
			})
			socket.on('vibrate', roomId => {
				io.to(roomId).emit('vibrate mobile')
			})

			socket.on('disconnect', () => {
				console.log(`User with id ${socket.id} disconnected`)
				player.removeUser(socket.id)
			})
		})
	})
	res.render('phone')
}

const phone_get = (req, res) => {
	res.render('index')
}

router.get('/desktop', desktop_get)
router.get('/desktop/:id', desktop_id)
router.get('/phone', phone_get)
router.get('/phone/:id', phone_id)

module.exports = router
