function Lerp(A, B, t) {
    return A+(B-A)*t
}

function Distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
}

function LineCircle(x1, y1, x2, y2, cX, cY, rad) {
    let lineLength = Distance(x1, y1, x2, y2)
    let point = (((cX - x1)*(x2 - x1)) + ((cY - y1)*(y2 - y1))) / Math.pow(lineLength, 2)

    let pX = x1 + (point*(x2 - x1))
    let pY = y1 + (point*(y2 - y1))

    if (Distance(pX, pY, cX, cY) < rad) return true
    else return false
}

function numX(percent) {
    return (percent/100)*canvas.width
}
function perX(number) {
    return (number/canvas.width)*100
}

function numY(percent) {
    return (percent/100)*canvas.height
}
function perY(number) {
    return (number/canvas.height)*100
}


function customAlert(message, type='error') {
    // killing previous alert
    let prevAlert = document.querySelectorAll('.custom-alert') || null
    if (prevAlert != null) {
        prevAlert.forEach(custom => {
            killAlert(custom)
        })
    }

    // creating custom-alert
    let customAlert = document.createElement('div')
    customAlert.classList.add('custom-alert')
    let msg = document.createElement('div')
    msg.classList.add('msg')
    msg.innerText = message
    let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
    svg.setAttributeNS(null, 'viewBox','0 0 50 50')
    let path = document.createElementNS('http://www.w3.org/2000/svg',"path")
    path.style.d = `path("M5,5 L45,45 M45,5 L5,45")`

    svg.appendChild(path)
    customAlert.appendChild(msg)
    customAlert.appendChild(svg)
    document.body.appendChild(customAlert)

    if (type != 'error') {
        customAlert.style.background = `var(--confirm-light)`
        customAlert.style.borderLeft = `0.5rem solid var(--confirm-dark)`
        msg.style.color = 'var(--text-color)'
        path.style.stroke = 'var(--text-color)'
    }

    // adding kill event in svg button
    svg.addEventListener('click', () => {
        killAlert(customAlert)
    })

    // automatic killling of alert
    setTimeout(() => {
        killAlert(customAlert)
    }, 5000)

    // alert killing function
    function killAlert(alert) {
        alert.style.bottom = '-30%'
        setTimeout(() => {
            alert.remove()
        }, 600)
    }
}

function validateFields(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == 0) return {i, bool:false}
    }
    return {bool:true}
}

function validatePassword(pass, conPass, len) {
    if (pass.value != conPass.value) return 'not match'
    if (pass.value.length < len) return 'short'
}

function validateEmail(email, shouldContain) {
    let admin = email.value.toLowerCase().indexOf('satyaprakash4253@gmail.com')
    if (shouldContain && admin < 0) return 'Unauthorized Email accessing Admin panel!'
    else if (!shouldContain && admin >= 0) return 'Cannot contain "admin" in the Email!'
    else return ''
}

function parseMonth(val) {
    if (val == 0) return 'Jan'
    else if (val == 1) return 'Feb'
    else if (val == 2) return 'Mar'
    else if (val == 3) return 'Apr'
    else if (val == 4) return 'May'
    else if (val == 5) return 'Jun'
    else if (val == 6) return 'Jul'
    else if (val == 7) return 'Aug'
    else if (val == 8) return 'Sep'
    else if (val == 9) return 'Oct'
    else if (val == 10) return 'Nov'
    else if (val == 11) return 'Dec'
}