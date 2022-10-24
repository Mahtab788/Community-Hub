// initializing Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC5YLLcSY-hKDcbKn8mpNqrRTJeEMUBD-U",
    authDomain: "coding-club-a7bd4.firebaseapp.com",
    projectId: "coding-club-a7bd4",
    storageBucket: "coding-club-a7bd4.appspot.com",
    messagingSenderId: "65183518465",
    appId: "1:65183518465:web:6de7a3181bfdd476c71500",
    measurementId: "G-BRSH2W3XQH"
};
firebase.initializeApp(firebaseConfig)


const loginElement = document.createElement('li')
const logOutElement = document.createElement('li')

loginElement.classList.add('login')
let anchorLogin = document.createElement('a')
anchorLogin.innerText = 'Login'
loginElement.appendChild(anchorLogin)
anchorLogin.href = './login.html'

logOutElement.classList.add('login')
let anchorLogout = document.createElement('a')
anchorLogout.innerText = 'Log Out'
logOutElement.appendChild(anchorLogout)

anchorLogout.addEventListener('click', () => {
    firebase.auth().signOut()
    .then(() => {
        let a = document.createElement('a')
        a.href = 'index.html'
        a.click()
    })
    .catch(error => {
        customAlert(error.message)
    })
})



let logo = document.querySelector('.logo')
let containers = document.querySelectorAll('.container')
let hamburger = document.querySelector('.hamburger')
let hamburgerClicked = false
let menu = document.querySelector('header .menu')
let footer = document.querySelector('.footer')
// let circlePointer = document.querySelector('.circle-pointer')
let header = document.querySelector('header').getBoundingClientRect()
let scrolledY = 0

function init() {
    containers.forEach((container, i) => {
        let totalMargin = parseInt(getComputedStyle(container).marginBlock)
        if (i === 0) container.style.minHeight = (innerHeight - 2*totalMargin) +'px'
        else container.style.minHeight = (innerHeight - totalMargin - header.height) +'px'
    })
}

// logo.innerText = '</>'
hamburger.querySelector('path').style.d = ` path('M8,15 L42,15 M8,25 L42,25 M8,35 L42,35')`
translateXTitle(0, [...containers, footer])
startUpdatingPosition()

hamburger.addEventListener('click', () => {
    hamburgerClicked = !hamburgerClicked
    if (hamburgerClicked) showMenu()
    else hideMenu()
    startUpdatingPosition()
})



function translateXTitle(value, containers) {
    containers.forEach(container => {
        container.style.transform = `translateX(${value}%)`
    })
}

function startUpdatingPosition() {
    let interval = setInterval(() => {
        applyCustomChanges()
    },10)
    setTimeout(() => {
        clearInterval(interval)
    }, 1000);
}

function showMenu() {
    canvasTranslateDireection = 'negative'
    hamburger.querySelector('path').style.d = ` path('M12,12 L38,38 M25,25 L25,25 M38,12 L12,38')`
    translateXTitle(-200, [...containers, footer])
    translatePolygons()
    menu.style.right = '50%'
}

function hideMenu() {
    canvasTranslateDireection = 'positive'
    hamburger.querySelector('path').style.d = ` path('M8,15 L42,15 M8,25 L42,25 M8,35 L42,35')`
    translateXTitle(0, [...containers, footer])
    translatePolygons()
    menu.style.right = '-100%'
}