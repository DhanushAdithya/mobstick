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

const canvas = document.getElementById('pong')

canvas.width = innerWidth
canvas.height = innerHeight

const ctx = canvas.getContext('2d')

const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 10,
	velocityX: 5,
	velocityY: 5,
	speed: 5,
	color: 'WHITE',
}

const user = {
	x: 0,
	y: (canvas.height - 100) / 2,
	width: 10,
	height: 100,
	score: 0,
	color: 'WHITE',
}

const com = {
	x: canvas.width - 10,
	y: (canvas.height - 100) / 2,
	width: 10,
	height: 100,
	score: 0,
	color: 'WHITE',
}

const net = {
	x: (canvas.width - 2) / 2,
	y: 0,
	height: 10,
	width: 2,
	color: 'WHITE',
}

function drawRect(x, y, w, h, color) {
	ctx.fillStyle = color
	ctx.fillRect(x, y, w, h)
}

function drawArc(x, y, r, color) {
	ctx.fillStyle = color
	ctx.beginPath()
	ctx.arc(x, y, r, 0, Math.PI * 2, true)
	ctx.closePath()
	ctx.fill()
}

function resetBall() {
	ball.x = canvas.width / 2
	ball.y = canvas.height / 2
	ball.velocityX = -ball.velocityX
	ball.speed = 10
}

function drawNet() {
	for (let i = 0; i <= canvas.height; i += 15) {
		drawRect(net.x, net.y + i, net.width, net.height, net.color)
	}
}

function drawText(text, x, y) {
	ctx.fillStyle = '#FFF'
	ctx.font = '75px fantasy'
	ctx.fillText(text, x, y)
}

function collision(b, p) {
	p.top = p.y
	p.bottom = p.y + p.height
	p.left = p.x
	p.right = p.x + p.width

	b.top = b.y - b.radius
	b.bottom = b.y + b.radius
	b.left = b.x - b.radius
	b.right = b.x + b.radius

	return (
		p.left < b.right &&
		p.top < b.bottom &&
		p.right > b.left &&
		p.bottom > b.top
	)
}

function update() {
	if (ball.x - ball.radius < 0) {
		com.score++
		socket.emit('vibrate', roomId)
		resetBall()
	} else if (ball.x + ball.radius > canvas.width) {
		user.score++
		//socket.emit('vibrate')
		resetBall()
	}

	ball.x += ball.velocityX
	ball.y += ball.velocityY

	com.y += (ball.y - (com.y + com.height / 2)) * 0.1

	if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
		ball.velocityY = -ball.velocityY
	}

	let player = ball.x + ball.radius < canvas.width / 2 ? user : com

	if (collision(ball, player)) {
		let collidePoint = ball.y - (player.y + player.height / 2)
		collidePoint = collidePoint / (player.height / 2)

		let angleRad = (Math.PI / 4) * collidePoint

		let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1
		ball.velocityX = direction * ball.speed * Math.cos(angleRad)
		ball.velocityY = ball.speed * Math.sin(angleRad)

		ball.speed += 0.3
	}
}

function render() {
	drawRect(0, 0, canvas.width, canvas.height, '#000')
	drawText(user.score, canvas.width / 4, canvas.height / 5)
	drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5)
	drawNet()
	drawRect(user.x, user.y, user.width, user.height, user.color)
	drawRect(com.x, com.y, com.width, com.height, com.color)
	drawArc(ball.x, ball.y, ball.radius, ball.color)
}
function game() {
	update()
	render()
}

game()

let framePerSecond = 50

const isPhone = () => {
	if (
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
			navigator.userAgent
		) ||
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
			navigator.userAgent.substr(0, 4)
		)
	)
		return true

	return false
}

socket.on('connect', () => {
	socket.emit('join', roomId)
})

socket.on('leave the room', () => {
	location.assign('/pong/desktop')
})

if (isPhone()) {
} else {
	socket.on('start', () => {
		let loop = setInterval(game, 1000 / framePerSecond)
		ball.velocityX = 5
		ball.velocityY = 5
		ball.speed = 5
	})

	socket.on('reset', () => {
		resetBall()
		user.x = 0
		user.y = (canvas.height - 100) / 2
		user.score = 0
		com.x = canvas.width - 10
		com.y = (canvas.height - 100) / 2
		com.score = 0
		ball.velocityX = 5
		ball.velocityY = 5
		ball.speed = 5
	})

	socket.on('mobile orientation', data => {
		if (data > 9) {
			user.y -= 2.2
			if (user.y < 0) {
				user.y = 10
			}
		} else if (data < -9) {
			user.y += 2.2
			if (user.y + 100 > canvas.height) {
				user.y = canvas.height - 110
			}
		} else {
			user.y = user.y
		}
	})
}
