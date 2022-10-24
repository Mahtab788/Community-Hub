let MONTH_IN_SECONDS = -2600000
let loader = document.querySelector('.loader')


let notifySection = document.querySelector('.notify-section')
let dataArray = []

let userStamp, viewedNotification
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        if (!user.emailVerified) return customAlert('Verify Your Email on the Mail!')
        
        // retrieving user timestamp from firebase
        firebase.database().ref().child('Users/'+user.uid).once('value', (snap) => {
            userStamp = snap.val()['time_stamp']
            viewedNotification = snap.val()['viewed_notification']
        })

        // retrieving notifications from firebase
        firebase.database().ref().child('Notifications').on('value', (snap) => {
            let data = snap.val()
            dataArray = []
            dataArray.push(GREETINGS)
            for (const obj in data) {
                if (Object.hasOwnProperty.call(data, obj)) {
                    let dataStamp = data[obj]['time']['stamp']
                    // console.log(dataStamp - userStamp);
                    if (dataStamp - userStamp < 0) continue

                    const notify = data[obj];
                    dataArray.push({title: notify['title'], message: notify['message'],
                    time: `${notify['time']['day']} ${notify['time']['month']} ${notify['time']['year']}`})
                }
            }

            // saving viewed notifications length
            firebase.database().ref().child('Users/'+user.uid+'/viewed_notification').set(dataArray.length)

            loginElement.remove()
            document.querySelector('.menu').appendChild(logOutElement)
            updateNotifySection()
            loader.style.opacity = 0
            setTimeout(() => {
                loader.remove()
            }, 300)
        })
    }
    else {
        customAlert('Login Required')
        logOutElement.remove()
        document.querySelector('.menu').appendChild(loginElement)
    }
})


// firebase.database().ref().child('Notifications').once('value', snap => { console.log(snap.val())
// }).then(() => {}).then(()=>{})

function updateNotifySection() {
    let prevIndex = dataArray.length - viewedNotification

    // deleting previous notification records
    let notifies = document.querySelectorAll('.notify')
    notifies.forEach(notify => {
        notify.remove()
    })

    // adding updated notifications
    dataArray.reverse()
    dataArray.forEach(data =>  addNotification(data.title, data.message, data.time))

    notifies = document.querySelectorAll('.notify')
    // adding Prev Notification Tag
    if (prevIndex <= notifies.length-1) {
        notifies[prevIndex].classList.add('prev-notification')
    }

    // adding New Notification Tag
    if (prevIndex != 0) {
        notifies[0].classList.add('new-notification')
        for (let i = 0; i < prevIndex; i++) {  
            let cover = document.createElement('div')
            cover.classList.add('cover')
            notifies[i].appendChild(cover)
        }
    }
}


function addNotification(title, message, time) {
    let notify = document.createElement('div')
    notify.classList.add('notify')
    let titleElem = document.createElement('div')
    titleElem.classList.add('sub-heading')
    titleElem.innerText = title
    let messageElem = document.createElement('div')
    messageElem.classList.add('message')
    messageElem.innerText = message
    let dateElem = document.createElement('div')
    dateElem.classList.add('date')
    dateElem.innerText = time

    notify.appendChild(titleElem)
    notify.appendChild(messageElem)
    notify.appendChild(dateElem)
    notifySection.appendChild(notify)
}

let GREETINGS = {
    title: 'Greeting to you, from Coding Club',
    message: 'We are glad to have you!',
    time: '8 Sep 2022'
}