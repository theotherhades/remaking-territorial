export default class GameEngine {
    constructor(canvasName) {
        this.canvas = document.getElementById(canvasName);
        this.canvasWidth = this.canvas.width - 4;
        this.canvasHeight = this.canvas.height - 4;
        this.ctx = this.canvas.getContext("2d");
        this.pixelsOwned = new Set([]);
        this.borderPixels = new Set([]);
        this.debugMode = false;

        // `nation` will be the internal name for player territory
        this.nations = {};
        this.player = "test";

        document.addEventListener("keydown", (event) => {
            if (event.code === "Space") {
                this.expandPixels(this.player);
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
    drawPixel(nation, x, y, init = false) {
        if (this.checkInt(x) === false || this.checkInt(y) === false) {
            console.error(`Pixels must only be drawn at coordinates divisible by 4\nProvided coordinates: (x:${x}, y:${y})`);
        } else {
            let taken = false;
            for (const nation of Object.keys(this.nations)) {
                if (this.nations[nation].pixelsOwned.has(`${x},${y}`)) {
                    taken = true;
                    break;
                }
            }
            if (!taken) {
                this.ctx.fillStyle = this.nations[nation].color;
                this.ctx.fillRect(x, y, 4, 4);
                this.nations[nation].pixelsOwned.add(`${x},${y}`);
                if (init) {
                    this.nations[nation].borderPixels.add(`${x},${y}`);
                }
            }
        }
    }

    /**
     * Register a new nation with the engine, for multiplayer.
     * @param {*} id The internal id for the nation.
     * @param {*} color The color the nation's pixels will be.
     * @param {*} isPlayer Does this nation belong to the client's player? (true or false)
     * @param {*} x
     * @param {*} y
     */
    registerNation(id, color, isPlayer, x, y) {
        this.nations[id] = {
            color: color,
            isPlayer: isPlayer,
            pixelsOwned: new Set([]),
            borderPixels: new Set([])
        };
        this.player = id;
        for (const pixel of [
            [x, y],
            [x + 4, y],
            [x, y + 4],
            [x + 4, y + 4],
            [x - 4, y],
            [x, y - 4],
            [x + 8, y],
            [x, y + 8],
            [x - 4, y + 4],
            [x + 4, y - 4],
            [x + 8, y + 4],
            [x, y + 8],
            [x + 4, y + 8]
        ]) {
            this.drawPixel(id, pixel[0], pixel[1], true);
        }
    }

    expandPixels(nation) {
        let pixelsToOccupy = new Set([]);

        for (let pixel of this.nations[nation].borderPixels) {
            pixel = pixel.split(",");
            for (const neighbor of [
                [parseInt(pixel[0]) - 4, parseInt(pixel[1])], // West
                [parseInt(pixel[0]), parseInt(pixel[1]) + 4], // South
                [parseInt(pixel[0]), parseInt(pixel[1]) - 4], // North
                [parseInt(pixel[0]) + 4, parseInt(pixel[1])], // East
            ]) {
                if (!(neighbor[0] < 0 || neighbor[0] > this.canvasWidth || neighbor[1] < 0 || neighbor[1] > this.canvasHeight)) {
                    if (this.nations[nation].pixelsOwned.has(`${neighbor[0]},${neighbor[1]}`)) {
                        if (this.debugMode) { console.log("pixel owned"); }
                        continue;
                    } else {
                        pixelsToOccupy.add(`${neighbor[0]},${neighbor[1]}`);
                    }
                } else if (this.debugMode) {
                    console.log("pixel is out of bounds");
                }
            }
        }
        for (let pixel of pixelsToOccupy) {
            pixel = pixel.split(",");
            this.drawPixel(nation, pixel[0], pixel[1]);
        }
        if (this.debugMode) { console.log(this.nations[nation].borderPixels); }
        this.nations[nation].borderPixels = new Set(pixelsToOccupy);
        if (this.debugMode) { console.log(this.nations[nation].borderPixels); }
    }
}