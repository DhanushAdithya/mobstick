const socket = io()

window.addEventListener('deviceorientation', e => {
	socket.emit('orientation', e.beta)
	document.querySelector('.text').textContent = e.beta
})
