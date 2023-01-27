export default class GameEngine {
    constructor(canvasName) {
        this.canvas = document.getElementById(canvasName);
        this.canvasWidth = this.canvas.width - 4;
        this.canvasHeight = this.canvas.height - 4;
        this.ctx = this.canvas.getContext("2d");
        this.pixelsOwned = new Set([]);
        this.borderPixels = new Set([]);

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
            this.pixelsOwned.add([x, y]);
            if (init) {
                this.borderPixels.add([x, y]);
            }
        }
    }

    expandPixels() {
        let pixelsToOccupy = new Set([]);
        /*
        this.borderPixels.forEach((pixel) => {
            [
                [pixel[0] - 4, pixel[1]], // West
                [pixel[0], pixel[1] + 4], // South
                [pixel[0], pixel[1] - 4], // North
                [pixel[0] + 4, pixel[1]], // East
            ].forEach((neighbor) => {
                if (this.pixelsOwned.has(neighbor)) {
                    return;
                } else {
                    pixelsToOccupy.add(neighbor);
                }
            });
        });
        pixelsToOccupy.forEach((pixel) => {
            this.drawPixel(pixel[0], pixel[1]);
        });
        */
        for (const pixel of this.borderPixels) {
            for (const neighbor of [
                [pixel[0] - 4, pixel[1]], // West
                [pixel[0], pixel[1] + 4], // South
                [pixel[0], pixel[1] - 4], // North
                [pixel[0] + 4, pixel[1]], // East
            ]) {
                if (this.pixelsOwned.has(neighbor)) {
                    continue;
                } else {
                    pixelsToOccupy.add(neighbor);
                }
            }
        }
        for (const pixel of pixelsToOccupy) {
            this.drawPixel(pixel[0], pixel[1]);
        }
        console.log(this.borderPixels);
        this.borderPixels = pixelsToOccupy;
        console.log(this.borderPixels);
    }
}