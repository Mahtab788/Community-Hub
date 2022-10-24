let BOUNCE = 0.65

class BouncingString{
    constructor(pos) {
        let middleX = Lerp(pos.x1, pos.x2, 0.5)
        let middleY = Lerp(pos.y1, pos.y2, 0.5)

        this.points = [
            {x:pos.x1, y:pos.y1, initialX:pos.x1, initialY:pos.y1, vX:0, vY:0},
            {x:middleX, y:middleY, initialX:middleX, initialY:middleY, vX:0, vY:0},
            {x:pos.x2, y:pos.y2, initialX:pos.x2, initialY:pos.y2, vX:0, vY:0}
        ]
        this.length = Distance(pos.x1, pos.y1, pos.x2, pos.y2)
        this.minDetect = this.length/100
        this.maxDetect = this.length/20

        this.minDetect = 20
        this.maxDetect = 100
        this.detect = this.minDetect
    }

    #applyEffect(mouseX, mouseY) {
        this.detect = this.maxDetect
        let tx = (this.points[1].initialX + mouseX) / 2
        let ty = mouseY
        this.points[1].vX = tx - this.points[1].x
        this.points[1].vY = ty - this.points[1].y
    }

    #dontApplyEffect() {
        this.detect = this.minDetect
        let tx = this.points[1].initialX
        let ty = this.points[1].initialY
        this.points[1].vX += tx - this.points[1].x
        this.points[1].vX *= BOUNCE
        this.points[1].vY += ty - this.points[1].y
        this.points[1].vY *= BOUNCE
    }

    draw(ctx, mouseX, mouseY) {
        if (LineCircle(this.points[0].x, this.points[0].y, this.points[2].x, this.points[2].y, mouseX, mouseY, this.detect)) {
            if (Distance(this.points[1].x, this.points[1].y, mouseX, mouseY) > this.length/2.2) this.#dontApplyEffect()
            else this.#applyEffect(mouseX, mouseY)
        }
        else this.#dontApplyEffect()

        this.points[1].x += this.points[1].vX
        this.points[1].y += this.points[1].vY

        let prevX = this.points[0].x, prevY = this.points[0].y
        ctx.lineTo(prevX, prevY)

        for (let i = 1; i < this.points.length; i++) {
            let cX = (prevX + this.points[i].x) / 2
            let cY = (prevY + this.points[i].y) / 2
            ctx.quadraticCurveTo(prevX, prevY, cX, cY)

            prevX = this.points[i].x
            prevY = this.points[i].y
        }
        ctx.lineTo(this.points[2].x, this.points[2].y)
    }
}