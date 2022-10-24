// initializing Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC5YLLcSY-hKDcbKn8mpNqrRTJeEMUBD-U",
    authDomain: "coding-club-a7bd4.firebaseapp.com",
    projectId: "coding-club-a7bd4",
    storageBucket: "coding-club-a7bd4.appspot.com",
    messagingSenderId: "65183518465",
    appId: "1:65183518465:web:6de7a3181bfdd476c71500",
    measurementId: "G-BRSH2W3XQH"
}
firebase.initializeApp(firebaseConfig)


const logOutElement = document.createElement('li')

logOutElement.classList.add('login')
let anchorLogout = document.createElement('a')
anchorLogout.innerText = 'Log Out'
logOutElement.appendChild(anchorLogout)

anchorLogout.addEventListener('click', () => {
    firebase.auth().signOut()
    .then(() => {
        
    })
    .catch(error => {
        customAlert(error.message)
    })
})

let adminLogin = document.querySelector('.container2')
let email = document.querySelector('form .email input')
let password = document.querySelector('form .password input')
let loginBtn = document.querySelector('#login-submit')

let loader = document.querySelector('.loader')
let svgShowHide = document.querySelectorAll('.svg-show-hide')
let passShowHide = document.querySelectorAll('.pass-show-hide')
svgShowHide.forEach((svg, i) => {
    svg.bool = false
    svg.addEventListener('click', () => {
        svg.bool = !svg.bool
        if (svg.bool) {
            passShowHide[i].type = 'text'
            svg.querySelector('path.diagonal').style.display = 'none'
        }
        else {
            passShowHide[i].type = 'password'
            svg.querySelector('path.diagonal').style.display = 'block'
        }
    })
})

loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    
    // validating fields
    let inputs = [email, password]
    let {i, bool} = validateFields(inputs)
    if (!bool) return customAlert(`${inputs[i].name} cannot be empty!`)

    // validating email
    let string = validateEmail(email, true)
    if (string != '') return customAlert(string)

    // validating password
    let res = validatePassword(password, password, 6)
    if (res == 'short') return customAlert(`${password.name} should be atleast 6 characters long!`)

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
        
    })
    .catch(error => {
        customAlert(error.message)
    })
})





// ***********************************************

let lists = document.querySelectorAll('.menu li a')
lists[0].onclick = () => showActiveUsers()
lists[1].onclick = () => showAllUsers()
lists[2].onclick = () => showSendNotifications()

let sendNotificationContainer = document.querySelector('.send-notification-container')
let sendNotificationSubmit = sendNotificationContainer.querySelector('#send-notification-submit')
sendNotificationContainer.remove()

let loginElement = adminLogin.querySelector('.login-container')
firebase.auth().onAuthStateChanged(user => {
    if (user) user.value = user.email
    if (user && validateEmail(user, true) == '' ) {
        loginElement.remove()
        document.querySelector('.menu').appendChild(logOutElement)
    } 
    else {
        logOutElement.remove()
        adminLogin.appendChild(loginElement)
    }
    // else {sendNotificationContainer.remove()}

    loader.style.opacity = 0
    setTimeout(() => {
        loader.remove()
    }, 300)
})



function showActiveUsers() {
    let res = checkAdminAuth()
    if (res != '') customAlert(res)
}
function showAllUsers() {
    let res = checkAdminAuth()
    if (res != '') customAlert(res)
}
function showSendNotifications() {
    let res = checkAdminAuth()
    if (res != '') customAlert(res)
    document.querySelector('.container2').appendChild(sendNotificationContainer)
}

function checkAdminAuth() {
    let user = firebase.auth().currentUser
    if (user) user.value = user.email
    if ((user && validateEmail(user, true) != '') || user == null) return 'Authentication Required!'
    else return ''
}


sendNotificationSubmit.addEventListener('click', (e) => {
    e.preventDefault()
    let res = checkAdminAuth()
    if (res != '') return customAlert(res)

    let title = sendNotificationContainer.querySelector('.title input')
    let message = sendNotificationContainer.querySelector('.message textarea')

    // validating fields
    let inputs = [title, message]
    let {i, bool} = validateFields(inputs)
    if (!bool) return customAlert(`${inputs[i].name} cannot be empty!`)

    let date = new Date()
    let stamp = Date.now()
    let day = date.getDate()
    let month = parseMonth(date.getMonth())
    let year = date.getFullYear()

    // sending new notification data to database
    let notification = {title: title.value, message: message.value, time: {day, month, year, stamp}}
    firebase.database().ref().child('Notifications').push().set(notification)
    .then(() => {
        customAlert('Notification Sent', '')
    })
    .catch(error => {
        customAlert(error.message)
    })


})



// pre defied code which is written in main.js

let logo = document.querySelector('.logo')
let containers = document.querySelectorAll('.container')
let hamburger = document.querySelector('.hamburger')
let hamburgerClicked = false
let menu = document.querySelector('header .menu')
let footer = document.querySelector('.footer')
let header = document.querySelector('header').getBoundingClientRect()
let scrolledY = 0

function init() {
    containers.forEach((container, i) => {
        let totalMargin = parseInt(getComputedStyle(container).marginBlock)
        if (i === 0) container.style.minHeight = (innerHeight - 2*totalMargin) +'px'
        else container.style.minHeight = (innerHeight - totalMargin - header.height) +'px'
    })
}

containers[0].style.display = 'none'
logo.innerText = '<Admin Panel />'
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