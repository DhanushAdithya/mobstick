const express = require('express')
const app = express()
const server = app.listen(3000, () => {
	console.log('Listening in port 3000')
})
const io = require('socket.io')(server)

app.use(express.static('public'))
app.use('/desktop', express.static(__dirname + '/public/desktop'))
app.use('/phone', express.static(__dirname + '/public/phone'))

io.on('connection', socket => {
	console.log(socket.id)
	socket.on('orientation', e => {
		io.emit('mobile orientation', e)
	})
})
