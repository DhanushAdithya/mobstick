const { Router } = require('express')
const router = Router()

const { Player } = require('../model/Player')
const player = new Player()

const phone = (req, res) => {
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
	res.render('pong_phone')
}

const desktop_pong = (req, res) => {
	const { id } = req.params
	const io = req.app.get('io')

	res.render('pong_desktop')

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

const desktop_atari = (req, res) => {
	const { id } = req.params
	const io = req.app.get('io')

	res.render('atari_desktop')

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

const desktop_dash = (req, res) => {
	const { id } = req.params
	const io = req.app.get('io')

	res.render('dash_desktop')

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
	res.render('connect')
}

const phone_get = (req, res) => {
	res.render('connect')
}

router.get('/', (req, res) => res.render('index'))

router.get('/pong/desktop', desktop_get)
router.get('/pong/phone', phone_get)
router.get('/pong/desktop/:id', desktop_pong)
router.get('/pong/phone/:id', phone)

router.get('/atari/desktop', desktop_get)
router.get('/atari/phone', phone_get)
router.get('/atari/desktop/:id', desktop_atari)
router.get('/atari/phone/:id', phone)

router.get('/dash/desktop/:id', desktop_dash)
router.get('/dash/phone/:id', phone)
router.get('/dash/desktop', desktop_get)
router.get('/dash/phone', phone_get)

module.exports = router
