let userName = document.createElement('div')
userName.classList.add('user-name')
let initial = document.createElement('div')
initial.classList.add('initial')
let nameLogged = document.createElement('div')
nameLogged.classList.add('name')
userName.appendChild(initial)
userName.appendChild(nameLogged)

let mainPageProfile = document.createElement('a')
mainPageProfile.classList.add('main-page-login')
mainPageProfile.innerText = 'Notifications'
mainPageProfile.href = './notification.html'




let loader = document.querySelector('.loader')
let mainPageLogin = document.querySelector('.main-page-login')
let noticeNumber = document.querySelector('.notice-number')
let viewedNotification, userStamp, dataArray=[]
let newNotifications = 0
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // loading users name, accont created timestamp, viewed notifications
        firebase.database().ref().child('Users/'+user.uid).once('value', snap => {
            userStamp = snap.val()['time_stamp']
            viewedNotification = snap.val()['viewed_notification']
            let name = snap.val()['name']

            initial.innerText = name[0].toUpperCase()
            nameLogged.innerText = name
            document.querySelector('.custom-navigation').insertBefore(userName, document.querySelector('.container1'))
            applyCustomChanges() // updates the name of Club
            loader.style.opacity = 0
            setTimeout(() => {
                loader.remove()
            }, 300)
        })
        // loading actual number of notifications readable by user
        firebase.database().ref().child('Notifications').on('value', snap => {
            let data = snap.val()
            dataArray = []
            dataArray.push('a')
            for (const obj in data) {
                let dataStamp = data[obj]['time']['stamp']
                if (dataStamp - userStamp < 0) continue
                dataArray.push('a')
            }
            
            newNotifications = dataArray.length - viewedNotification
            if (newNotifications == 0) noticeNumber.style.display = 'none'
            else {
                noticeNumber.style.display = 'flex'
                noticeNumber.innerText = newNotifications
            }
        })

        document.querySelector('.actions').appendChild(mainPageProfile)
        mainPageLogin.remove()
        loginElement.remove()
        document.querySelector('.menu').appendChild(logOutElement)
        document.documentElement.style.setProperty('--container-adjust-margin', '13vh')
    }
    else {
        noticeNumber.style.display = 'none'
        document.querySelector('.actions').appendChild(mainPageLogin)
        mainPageProfile.remove()
        userName.remove()
        logOutElement.remove()
        document.querySelector('.menu').appendChild(loginElement)
        document.documentElement.style.setProperty('--container-adjust-margin', '8vh')
        loader.style.opacity = 0
        setTimeout(() => {
            loader.remove()
        }, 300)
    }
})




let writeUps = document.querySelectorAll('.write-up')

writeUps.forEach(writeUp => {
    writeUp.checked = false
    writeUp.querySelector('svg').onclick = () => {
        writeUp.checked = !writeUp.checked
        if (writeUp.checked) {
            writeUp.querySelector('svg path').style.d = `path("M10,10 L40,40 M40,10 L10,40")`
            writeUp.style.clipPath = 'circle(150% at calc(100% - 1.5rem) 1.5rem)'
        }
        else {
            writeUp.querySelector('svg path').style.d = `path("M25,10 L25,15 M25,25 L25,40")`
            writeUp.style.clipPath = 'circle(1rem at calc(100% - 1.5rem) 1.5rem)'
        }
    }
})