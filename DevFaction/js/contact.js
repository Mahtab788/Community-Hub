let loader = document.querySelector('.loader')

let container1 = document.querySelector('.container1')
container1.style.display = 'none'


let name = document.querySelector('.name input')
let email = document.querySelector('.email input')
let subject = document.querySelector('.subject input')
let message = document.querySelector('.message textarea')
let messageBtn = document.querySelector('#message-submit')

messageBtn.addEventListener('click', (e) => {
    e.preventDefault()

    // validating fields
    let inputs = [name, email, subject, message]
    let {i, bool} = validateFields(inputs)
    if (!bool) return customAlert(`${inputs[i].name} cannot be empty!`)

    // Sending Message
    let messageInfo = {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value,
        time_stamp: Date.now()
    }
    firebase.database().ref().child(`Messages`).push().set(messageInfo)
    .then(() => {
        customAlert('Message sent successfully','')
    })
    .catch(error => {
        customAlert(error.message)
    })    
})



firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.querySelector('.menu').appendChild(logOutElement)
        loginElement.remove()
    }
    else {
        document.querySelector('.menu').appendChild(loginElement)
        logOutElement.remove()
    }
    loader.style.opacity = 0
    setTimeout(() => {
        loader.remove()
    }, 300)
})