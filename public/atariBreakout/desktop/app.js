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

const canvas = document.getElementById('myCanvas')
canvas.width = innerWidth
canvas.height = innerHeight

const ctx = canvas.getContext('2d')
const ballRadius = 10
let x = canvas.width / 2
let y = canvas.height - 30
let dx = 3
let dy = -3
const paddleHeight = 10
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2
const brickRowCount = 17
const brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30
let right = false
let left = false
let score = 0
let lives = 3
let start = false

let bricks = []
for (let c = 0; c < brickColumnCount; c++) {
	bricks[c] = []
	for (let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 }
	}
}

function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r]
			if (b.status == 1) {
				if (
					x > b.x &&
					x < b.x + brickWidth &&
					y > b.y &&
					y < b.y + brickHeight
				) {
					dy = -dy
					b.status = 0
					score++
					if (score == brickRowCount * brickColumnCount) {
						alert('YOU WIN, CONGRATS!')
						document.location.reload()
					}
				}
			}
		}
	}
}

function drawBall() {
	ctx.beginPath()
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
	ctx.fillStyle = 'WHITE'
	ctx.fill()
	ctx.closePath()
}
function drawPaddle() {
	ctx.beginPath()
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
	ctx.fillStyle = 'WHITE'
	ctx.fill()
	ctx.closePath()
}
function drawBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft
				let brickY = c * (brickHeight + brickPadding) + brickOffsetTop
				bricks[c][r].x = brickX
				bricks[c][r].y = brickY
				ctx.beginPath()
				ctx.rect(brickX, brickY, brickWidth, brickHeight)
				ctx.fillStyle = 'WHITE'
				ctx.fill()
				ctx.closePath()
			}
		}
	}
}
function drawScore() {
	ctx.font = '16px Arial'
	ctx.fillStyle = 'WHITE'
	ctx.fillText('Score: ' + score, 8, 20)
}
function drawLives() {
	ctx.font = '16px Arial'
	ctx.fillStyle = 'WHITE'
	ctx.fillText('Lives: ' + lives, canvas.width - 65, 20)
}

function startGame() {
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx
	}
	if (y + dy < ballRadius) {
		dy = -dy
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy
		} else {
			lives--
			if (!lives) {
				alert('GAME OVER')
				document.location.reload()
			} else {
				x = canvas.width / 2
				y = canvas.height - 30
				dx = 3
				dy = -3
				paddleX = (canvas.width - paddleWidth) / 2
			}
		}
	}

	if (right && paddleX < canvas.width - paddleWidth) {
		paddleX += 6
	} else if (left && paddleX > 0) {
		paddleX -= 6
	}

	x += dx
	y += dy

	requestAnimationFrame(draw)
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawBricks()
	drawBall()
	drawPaddle()
	drawScore()
	drawLives()
	collisionDetection()

	if (start) {
		startGame()
	}
}

draw()

socket.on('connect', () => {
	socket.emit('join', roomId)
})

socket.on('leave the room', () => {
	location.assign('/atari/desktop')
})

socket.on('start', () => {
	console.log('start')
	start = true
	draw()
})

if (isPhone()) {
} else {
	socket.on('mobile orientation', data => {
		if (data > 9) {
			right = true
			left = false
		} else if (data < -9) {
			right = false
			left = true
		} else {
			right = false
			left = false
		}
	})

	socket.on('reset', () => {
		console.log('reset')
		document.location.reload()
	})
}
