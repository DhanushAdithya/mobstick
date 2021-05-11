const socket = io()

if (isPhone()) {
	console.log('Not a phone')
} else {
	socket.on('mobile orientation', data => {
		document.querySelector('.box').style.translate = `${data}px`
	})
}
