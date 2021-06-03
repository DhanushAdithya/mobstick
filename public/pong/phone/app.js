const socket = io()

const roomId = new URL(location).pathname
	.split('/')
	.filter(
		e =>
			!(
				e === 'mobile' ||
				e === 'desktop' ||
				e === '' ||
				e === 'pc' ||
				e === 'pong' ||
				e === 'atari' ||
				e === 'dash' ||
				e === 'phone'
			)
	)[0]

const start = document.querySelector('.start')
const reset = document.querySelector('.reset')

const debounce = (method, delay) => {
	clearTimeout(method._tId)
	method._tId = setTimeout(() => method(), delay)
}

const handleOrientation = e => {
	socket.emit('orientation', [roomId, e.beta])
}

socket.on('connect', () => {
	socket.emit('join', roomId)
})

socket.on('leave the room', () => {
	location.assign('/pong/phone')
})

window.addEventListener('deviceorientation', e =>
	debounce(handleOrientation(e), 300)
)

socket.on('vibrate mobile', () => {
	navigator.vibrate(200)
})

start.addEventListener('click', () => {
	socket.emit('start', roomId)
})

reset.addEventListener('click', () => {
	socket.emit('reset', roomId)
})
