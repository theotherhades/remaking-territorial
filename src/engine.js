export default class GameEngine {
    constructor(canvasName) {
        this.canvas = document.getElementById(canvasName);
        this.canvasWidth = this.canvas.width - 4;
        this.canvasHeight = this.canvas.height - 4;
        this.ctx = this.canvas.getContext("2d");
        this.pixelsOwned = new Set([]);
        this.borderPixels = new Set([]);
        this.debugMode = false;

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
    drawPixel(x, y, init = false) {
        if (this.checkInt(x) === false || this.checkInt(y) === false) {
            console.error(`Pixels must only be drawn at coordinates divisible by 4\nProvided coordinates: (x:${x}, y:${y})`);
        } else {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(x, y, 4, 4);
            this.pixelsOwned.add(`${x},${y}`);
            if (init) {
                this.borderPixels.add(`${x},${y}`);
            }
        }
    }

    /**
     * Checks if pixel (x, y) is owned.
     * @param {*} x 
     * @param {*} y 
     */
    hasPixel(x, y) {
        return this.pixelsOwned.has(`${x},${y}`);
    }

    expandPixels() {
        let pixelsToOccupy = new Set([]);

        for (let pixel of this.borderPixels) {
            pixel = pixel.split(",");
            for (const neighbor of [
                [parseInt(pixel[0]) - 4, parseInt(pixel[1])], // West
                [parseInt(pixel[0]), parseInt(pixel[1]) + 4], // South
                [parseInt(pixel[0]), parseInt(pixel[1]) - 4], // North
                [parseInt(pixel[0]) + 4, parseInt(pixel[1])], // East
            ]) {
                if (this.hasPixel(neighbor[0], neighbor[1])) {
                    if (this.debugMode) { console.log("pixel owned"); }
                    continue;
                } else {
                    pixelsToOccupy.add(`${neighbor[0]},${neighbor[1]}`);
                }
            }
        }
        for (let pixel of pixelsToOccupy) {
            pixel = pixel.split(",");
            this.drawPixel(pixel[0], pixel[1]);
        }
        if (this.debugMode) { console.log(this.borderPixels); }
        this.borderPixels = new Set(pixelsToOccupy);
        if (this.debugMode) { console.log(this.borderPixels); }
    }
}