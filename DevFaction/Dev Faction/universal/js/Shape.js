class Shape{
    constructor(x, y, length, sides, rotation, color, offset = {x:0, y:0}) {
        this.stored = {x: perX(x), y: perY(y)}
        this.offset = offset
        this.x = x + this.offset.x
        this.finalY = y + this.offset.y
        // this.initialY = (Math.random()*0.7 + 0.3)*-innerHeight
        this.y = this.finalY
        this.length = length
        this.currentLength = 0
        this.sides = sides
        this.rotation = rotation
        this.color = color
        this.angle = 2*Math.PI/sides
        this.speed = this.acceleration = 0.2
        // this.angularVelocity = Math.random()*0.001
        this.animation = 'POPIN'
        this.drawn = false
        this.translateXAmount = parseInt(innerWidth*0.7)
        this.remainingTranslateXAmount = 0

        this.points = this.strings = []

    }

    init(length = this.length) {
        this.drawn = true
        this.points = []
        this.strings = []

        for (let i = 0; i < this.sides; i++) {
            this.points.push({
                x: this.x + Math.sin(this.rotation + Math.PI + this.angle*i)*length,
                y: this.y + Math.cos(this.rotation + Math.PI + this.angle*i)*length
            })
        }

        this.line = this.sides === 2? true : false
        for (let i = 0; i < this.points.length; i++) {
            this.strings.push(
                new BouncingString({
                    x1:this.points[i].x,
                    y1:this.points[i].y,
                    x2:this.points[(i+1)%this.points.length].x,
                    y2:this.points[(i+1)%this.points.length].y
                })
            )
        }
    }

    playPopin() {
        this.currentLength = 5
        this.animation = 'POPIN'
    }
    popin() {
        if (this.currentLength < this.length) this.init(this.currentLength)
        if (this.currentLength < this.length) {
            this.currentLength += this.speed
            this.speed += this.acceleration
        }
        else {
            this.currentLength = this.length
            this.animation = ''
        }
    }
    
    playPopout() {
        this.currentLength = this.length
        this.animation = 'POPOUT'
    }
    popout() {
        if (this.currentLength <= this.length && this.currentLength >= 0) this.init(this.currentLength)
        if (this.currentLength >= 0) {
            this.currentLength -= this.speed
            this.speed += this.acceleration
        }
        else {
            this.currentLength = 0
            this.animation = ''
        }
    }

    translateX(type, dx) {
        this.translateXAmount -= dx
        this.remainingTranslateXAmount = this.translateXAmount
        if (type === 'positive') this.x += dx
        else if (type === 'negative') this.x -= dx
        this.init()
        if (this.translateXAmount <= 0) {
            this.animation = ''
            this.translateXAmount = parseInt(innerWidth*0.7)

            // if (this.x < 10 || this.x > innerWidth) this.playPopout()
            // else if (this.x > 10 && this.x < innerWidth) this.playPopin()
        }
    }

    draw(ctx, mouseX = undefined, mouseY = undefined) {
        ctx.lineWidth = 10
        ctx.fillStyle = ctx.strokeStyle = this.color
        ctx.beginPath()
        for (let i = 0; i < this.strings.length; i++) {
            this.strings[i].draw(ctx, mouseX, mouseY)
        }
        ctx.fill()
        if (this.line) ctx.stroke()
        ctx.closePath()
    }
}