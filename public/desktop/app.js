const socket = io()

if (isPhone()) {
} else {
	socket.on('mobile orientation', data => {
		document.querySelector('.box').style.translate = `${data}px`
	})
}
