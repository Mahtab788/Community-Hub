let canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')
canvas.width = canvas.style.width = innerWidth
canvas.height = canvas.style.height = innerHeight
let title = document.querySelector('.container1 .title')
let secondRect = document.querySelector('.container1 .second').getBoundingClientRect()
let refDot = document.querySelector('.container1 .dot').getBoundingClientRect()

let Mouse = {x:undefined, y:undefined}
let bounce1 = new BouncingString({x1:200, y1:200, x2:600, y2:200}, '#f66')

let ORANGE = '#e17519'
let LIGHT_ORANGE = '#ff973e'
let RED = '#e12b19'
let GREEN = '#b0e119'
let YELLOW = '#f1ea1b'
let BLUE = '#198ee1'
let LIGHT_BLUE = '#d1e9e9'
let PRIMARY = getComputedStyle(document.body).getPropertyValue('--primary')

// let parallaxes = [
//     {element:canvas, status: 'active', delay:0.5},
// ]

let obj1 = new Shape(0, 0, 0, 2, 0, PRIMARY)
let obj2 = new Shape(0, 0, 0, 3, -Math.PI/24, LIGHT_ORANGE)  // n - 2
let obj3 = new Shape(0, 0, 0, 3, Math.PI/4, RED)

let polygons = [
    new Shape(numX(71.75), numY(11.4), 50, 3, -Math.PI/3, GREEN),
    new Shape(numX(71.75), numY(11.4), 25, 3, 0, BLUE, {x:50, y:0}),
    new Shape(numX(68.56), numY(83.1), 100, 4, Math.PI/12, BLUE),
    new Shape(numX(68.56), numY(83.1), 25, 3, 0, ORANGE, {x:53, y:85}),
    new Shape(numX(11.13), numY(79.15), 15, 3, Math.PI/8, GREEN), // 4
    new Shape(numX(99.2), numY(45.66), 60, 4, Math.PI/2, YELLOW), // 5
    new Shape(numX(2.75), numY(7.6), 80, 20, 0, LIGHT_BLUE),

    new Shape(numX(155), numY(67), 100, 3, Math.PI/8, LIGHT_ORANGE),
    new Shape(numX(155), numY(67), 20, 3, -Math.PI/5, GREEN, {x:50, y:55}),
    new Shape(numX(166), numY(26), 30, 3, Math.PI/4, LIGHT_BLUE),

    // Below shapes change values on resize
    obj1,obj2,obj3
] 

let canvasTranslateSpeed = parseInt(innerWidth/20)
let canvasTranslateDireection = 'negative'



function animate() {
    canvas.width = innerWidth
    // canvas.height = innerHeight

    polygons.forEach(polygon => {
        if (polygon.animation === 'POPIN') polygon.popin()
        else if (polygon.animation === 'POPOUT') polygon.popout()
        else if (polygon.animation === 'TRANSLATEX') polygon.translateX(canvasTranslateDireection, canvasTranslateSpeed)
        else if (!polygon.drawn) polygon.init()
        polygon.draw(ctx, Mouse.x, Mouse.y)
    })


    // updateMouse(ctx, Mouse.x, Mouse.y)

    requestAnimationFrame(animate)
}
setTimeout(() => {
    animate()
}, 300);


window.addEventListener('mousemove', (e) => {
    Mouse.x = e.x
    Mouse.y = e.y
})

window.addEventListener('touchmove', (e) => {
    Mouse.x = e.changedTouches[0].clientX
    Mouse.y = e.changedTouches[0].clientY
})
window.addEventListener('touchend', (e) => {
    Mouse.x = undefined
    Mouse.y = undefined
})


window.addEventListener('resize', () => {
    init()
    // preventing distortion of menu during resizing
    if (hamburgerClicked) {
        hideMenu()
        hamburgerClicked = false
    }
    menu.style.right = null


    polygons.forEach(polygon => {
        polygon.x = numX(polygon.stored.x) + polygon.offset.x
        polygon.y = numY(polygon.stored.y) + polygon.offset.y
        polygon.init()
    })
    
    applyCustomChanges()
})

window.addEventListener('load', () => {
    init()
    applyCustomChanges()
})

document.querySelector('.custom-navigation').onscroll = (e) => {
    applyCustomChanges()
    if (hamburgerClicked) return window.scrollTo(0, scrolledY)
    scrolledY = window.pageYOffset
    // parallaxes.forEach(parallax => {
    //     if (parallax.status === 'active') parallax.element.style.transform = `translateY(${-window.pageYOffset*parallax.delay}px)`
    // })
}


function updateMouse(ctx, mouseX, mouseY) {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#333'
    ctx.beginPath()
    ctx.arc(mouseX, mouseY, 20, 0, 2*Math.PI)
    ctx.stroke()
    ctx.closePath()
}

function customChange(poly, x, y, length) {
    poly.x = x
    poly.y = y
    poly.length = length
    poly.init()
}

function applyCustomChanges() {
    title.style.height = secondRect.height*1.5 + 'px'
    secondRect = document.querySelector('.container1 .second').getBoundingClientRect()
    refDot = document.querySelector('.container1 .dot').getBoundingClientRect()
    // customChange(obj3, refDot.left, refDot.top*1.02, secondRect.height/5)
    // customChange(obj2, secondRect.left + secondRect.width/2, refDot.top + secondRect.top/1, secondRect.height*1.1)
    customChange(obj1, secondRect.left + secondRect.width*1.05, secondRect.top*1.15 , secondRect.height/1.7)
}


function popinPolygons() {
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].playPopin()
    }
}

function popoutPolygons() {
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].playPopout()
    }
}

function translatePolygons() {
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].translateXAmount = parseInt(innerWidth*0.7) - polygons[i].remainingTranslateXAmount
        polygons[i].animation = 'TRANSLATEX'
    }
}

