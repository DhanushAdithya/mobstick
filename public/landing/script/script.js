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
