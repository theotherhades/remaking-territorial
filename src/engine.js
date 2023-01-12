export default class GameEngine {
    constructor(canvasName) {
        this.canvas = document.getElementById(canvasName);
        this.canvasWidth = this.canvas.width - 4;
        this.canvasHeight = this.canvas.height - 4;
        this.ctx = this.canvas.getContext("2d");
        this.pixelsOwned = [];

        document.addEventListener("keyup", (event) => {
            if (event.code === "Space") {
                this.expandPixels();
            }
        });
    }

    /**
     * Checks if provided integer is divisible by 4 and returns with true or false.
     * @param {*} num
     * @returns bool
     */
    checkInt(num) {
        if (num % 4 === 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Draws a pixel at coordinates (x, y)
     * @param {*} x
     * @param {*} y
     */
    drawPixel(x, y) {
        if (this.checkInt(x) === false || this.checkInt(y) === false) {
            console.error(`Pixels must only be drawn at coordinates divisible by 4\nProvided coordinates: (x:${x}, y:${y})`);
        } else {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(x, y, 4, 4);
            this.pixelsOwned.push([x, y]);
            console.log(this.pixelsOwned);
        }
    }

    expandPixels() {
        let pixelsToOccupy = [];
        this.pixelsOwned.forEach((pixel) => {
            [
                [pixel[0] - 4, pixel[1]], // West
                [pixel[0], pixel[1] + 4], // South
                [pixel[0], pixel[1] - 4], // North
                [pixel[0] + 4, pixel[1]], // East
            ].forEach((neighbor) => {
                if (this.pixelsOwned.includes(neighbor)) {
                    return;
                } else {
                    pixelsToOccupy.push(neighbor);
                }
            });
        });
        pixelsToOccupy.forEach((pixel) => {
            this.drawPixel(pixel[0], pixel[1]);
        });
    }
}