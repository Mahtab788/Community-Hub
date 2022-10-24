let roomId = ''
window.onload = () => {
    const sock = io()

    // variables which are setted from server
    sock.on('join', (msg, id, className) => {
        roomId = id
        createLi(msg+id, className)
    })
    sock.on('message', (msg, className) => {
        createLi(msg, className)
    })
    sock.on('update-members', roomSize => {
        updateMemberNumbers(roomSize)
    })
    sock.on('reset-room-id', () => {
        roomId = ''
    })
    sock.on('theme-change', () => {
        changeTheme()
    })
    sock.on('alert-msg', msg => {
        alert(msg)
    })
    sock.on('chat-room-active', () => {
        mainPage.style.display = 'none'
        chatRoom.style.display = 'block'
    })
    sock.on('main-page-active', () => {
        optClicked = !optClicked
        optionsUnPressed()
        mainPage.style.display = 'flex'
        chatRoom.style.display = 'none'
    })

    let mainPage = document.querySelector('#main-page')
    let createRoomBtn = document.querySelector('#create-room')
    let mainRoomIdBox = document.querySelector('#main-room-id-box')
    let mainJoinBtn = document.querySelector('#main-join-btn')

    let chatRoom = document.querySelector('#chat-room')
    let connectArea = document.querySelector('.connect-rooms')
    let msgBox = document.querySelector('#msg-box')
    let sendBtn = document.querySelector('#send-btn')
    let messageArea = document.querySelector('.message-area')
    // let themeBtn = document.querySelector('#theme-btn')
    // let darkTheme = false
    let optionsBtn = document.querySelector('.writting-area form svg')
    let roomIdBox = document.querySelector('#room-id-box')
    let joinBtn = document.querySelector('#join-btn')
    let members = document.querySelector('#members')
    let leaveRoomBtn = document.querySelector('#leave-room')

    let optPath = `path("M10,20 L20,10 M10,40 L40,10 M30,40 L40,30")`
    let closePath = `path("M10,10 L25,25 M10,40 L40,10 M25,25 L40,40")`
    let optClicked = false
    mainPage.style.height = chatRoom.style.height = window.innerHeight+'px'
    messageArea.style.height = `calc(${window.innerHeight}px - 7.5rem)`
    messageArea.style.maxHeight = `calc(${window.innerHeight}px - 7.5rem)`
    optionsBtn.querySelector('path').style.d = optPath

    const createLi = (msg, className) => {
        if (msg == 0) return
        let li = document.createElement('li')
        li.classList.add(className)
        let div = document.createElement('div')
        div.classList.add('text')
        div.classList.add(className)
        div.innerText = msg
        li.appendChild(div)
        msgBox.value = ''
        messageArea.appendChild(li)
    }

    // const changeTheme = () => {
    //     darkTheme = !darkTheme
    //     if (!darkTheme) return document.body.style.background = '#fff'
    //     document.body.style.background = '#bbb'
    // }

    const joinRoom = (e,id) => {
        e.preventDefault()
        sock.emit('join-room', id, roomId)
    }

    const join = (e,id) => {
        e.preventDefault()
        sock.emit('join', id)
    }

    const updateMemberNumbers = (roomSize) => {
        members.innerText = roomSize
    }

    const leaveRoom = (e) => {
        e.preventDefault()
        sock.emit('leave-room')
    }

    const optionsPressed = () => {
        optionsBtn.querySelector('path').style.d = closePath
        msgBox.style.display = 'none'
        sendBtn.style.display = 'none'
        leaveRoomBtn.style.display = 'block'
    }

    const optionsUnPressed = () => {
        optionsBtn.querySelector('path').style.d = optPath
        msgBox.style.display = 'block'
        sendBtn.style.display = 'block'
        leaveRoomBtn.style.display = 'none'
    }


    // initial page
    createRoomBtn.addEventListener('click', (e) => {
        e.preventDefault()
        sock.emit('create-room')
    })

    mainJoinBtn.addEventListener('click', (e) => {
        let id = mainRoomIdBox.value
        join(e,id)
        mainRoomIdBox.value = ''
    })

    // messaging page
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault()
        let msg = msgBox.value
        sock.emit('message', msg)
    })

    // themeBtn.addEventListener('click', () => {
    //     sock.emit('theme-change')
    // })

    joinBtn.addEventListener('click', (e) => {
        let id = roomIdBox.value
        joinRoom(e,id)
        roomIdBox.value = ''
    })

    leaveRoomBtn.addEventListener('click', (e) => {
        leaveRoom(e)
    })

    optionsBtn.addEventListener('click', () => {
        optClicked = !optClicked
        if (optClicked) optionsPressed()
        else optionsUnPressed()
    })
}