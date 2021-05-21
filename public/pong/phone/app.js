const socket = io()

socket.on('connect', () => {
	socket.emit('join', roomId)
})

const roomId = new URL(location).pathname
	.split('/')
	.filter(
		e =>
			!(
				e === 'mobile' ||
				e === 'desktop' ||
				e === '' ||
				e === 'pc' ||
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

socket.on('leave', () => {
	console.log('leave')
	location.assign('/phone')
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
