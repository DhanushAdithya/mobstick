const { Router } = require('express')
const router = Router()

const { Player } = require('../model/Player')
const player = new Player()

const phone = (req, res) => {
	const io = req.app.get('io')

	io.on('connection', socket => {
		socket.on('join', roomId => {
			console.log('Phone:', socket.id, roomId)
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
				console.log(`${socket.id} disconnected`)
				player.removeUser(socket.id)
			})
		})
	})
	res.render('pong_phone')
}

const desktop_pong = (req, res) => {
	const io = req.app.get('io')

	io.on('connection', socket => {
		socket.on('join', roomId => {
			console.log('Desktop:', socket.id, roomId)
			socket.join(roomId)

			player.removeUser(socket.id)
			player.addUser(socket.id, roomId)

			if (player.roomCount(roomId)) {
				io.to(socket.id).emit('leave the room')
			}

			socket.on('disconnect', () => {
				console.log(`${socket.id} disconnected`)
				player.removeUser(socket.id)
			})
		})
	})

	res.render('pong_desktop')
}

const desktop_atari = (req, res) => {
	const io = req.app.get('io')

	io.on('connection', socket => {
		socket.on('join', roomId => {
			console.log('Desktop:', socket.id, roomId)
			socket.join(roomId)

			player.removeUser(socket.id)
			player.addUser(socket.id, roomId)

			if (player.roomCount(roomId)) {
				io.to(socket.id).emit('leave the room')
			}

			socket.on('disconnect', () => {
				console.log(`${socket.id} disconnected`)
				player.removeUser(socket.id)
			})
		})
	})

	res.render('atari_desktop')
}

const desktop_dash = (req, res) => {
	const io = req.app.get('io')

	io.on('connection', socket => {
		socket.on('join', roomId => {
			console.log('Desktop:', socket.id, roomId)
			socket.join(roomId)

			player.removeUser(socket.id)
			player.addUser(socket.id, roomId)

			if (player.roomCount(roomId)) {
				io.to(socket.id).emit('leave the room')
			}

			socket.on('disconnect', () => {
				console.log(`${socket.id} disconnected`)
				player.removeUser(socket.id)
			})
		})
	})

	res.render('dash_desktop')
}

const connect = (req, res) => {
	res.render('connect')
}

router.get('/', (req, res) => res.render('index'))

router.get('/pong/desktop', connect)
router.get('/pong/phone', connect)
router.get('/pong/desktop/:id', desktop_pong)
router.get('/pong/phone/:id', phone)

router.get('/atari/desktop', connect)
router.get('/atari/phone', connect)
router.get('/atari/desktop/:id', desktop_atari)
router.get('/atari/phone/:id', phone)

router.get('/dash/desktop', connect)
router.get('/dash/phone', connect)
router.get('/dash/desktop/:id', desktop_dash)
router.get('/dash/phone/:id', phone)

module.exports = router
