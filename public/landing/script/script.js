window.onload = () => {
	const sg = document.querySelectorAll('.sg')
	const cr = document.querySelectorAll('.cr')

	const device = isPhone() ? 'phone' : 'desktop'
	const games = ['pong', 'atari', 'dash']

	sg.forEach((elm, i) => {
		elm.href = `${games[i]}/${device}/${chance.string({
			length: 6,
			numeric: true,
			alpha: true,
			symbols: false,
			casing: 'lower',
		})}`
	})

	cr.forEach((elm, i) => {
		elm.href = `${games[i]}/${device}/`
	})
}

window.onscroll = () => {
	scrollFunction()
}

const scrollFunction = () => {
	document.getElementById('nav').style.top =
		document.body.scrollTop > 300 || document.documentElement.scrollTop > 300
			? '0'
			: '-10rem'
}

const hamburger = document.querySelector('.hamburger')
const navLinks = document.querySelector('.nav-links')
const links = document.querySelectorAll('.nav-links li')

hamburger.addEventListener('click', () => {
	navLinks.classList.toggle('open')
	links.forEach(link => {
		link.classList.toggle('fade')
	})
	hamburger.classList.toggle('toggle')
})
