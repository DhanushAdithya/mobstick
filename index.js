const express = require('express')
const app = express()
const server = app.listen(3000, () => {
	console.log('Listening in port 3000')
})
const io = require('socket.io')(server)
const gameRoutes = require('./routes/routes')

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('io', io)

app.use(gameRoutes)
