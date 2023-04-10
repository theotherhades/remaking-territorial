export default class GameEngine {
    constructor(canvasName, debug = false) {
        this.canvas = document.getElementById(canvasName);
        this.canvasWidth = this.canvas.width - 4;
        this.canvasHeight = this.canvas.height - 4;
        this.ctx = this.canvas.getContext("2d");
        this.pixelsOwned = new Set([]);
        this.borderPixels = new Set([]);
        this.debugMode = debug;

        // `nation` will be the internal name for player territory
        this.nations = {};
        this.player = "test";

        document.addEventListener("keydown", (event) => {
            if (event.code === "Space") {
                this.serverExpandPixels(this.player);
            }
        });

        document.addEventListener("click", (event) => {
            this.serverAttackNation(event);
        });

        if (this.debugMode) {
            console.log("Debug mode is enabled");
        }

        this.connectToServer();
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
     * @param {*} isBorder Determines if the pixel should be drawn as a border pixel and added to the `borderPixels` set. Defaults to `false`.
     */
    drawPixel(nation, x, y, isBorder = false) {
        if (this.checkInt(x) === false || this.checkInt(y) === false) {
            console.error(`Pixels must only be drawn at coordinates divisible by 4\nProvided coordinates: (x:${x}, y:${y})`);
        } else {
            if (isBorder) {
                this.ctx.fillStyle = this.nations[nation].borderColor;
            } else {
                this.ctx.fillStyle = this.nations[nation].color;
            }
            this.ctx.fillRect(x, y, 4, 4);
        }
    }

    /**
     * Register a new nation with the server.
     * @param {*} id The internal id for the nation.
     * @param {*} color The color the nation's pixels will be.
     * @param {*} borderColor The color the nation's border pixels will be.
     * @param {*} x
     * @param {*} y
     */
    registerNation(id, color, borderColor, x, y) {
        let data = {
            type: "registerNation",
            id: id,
            color: color,
            borderColor: borderColor,
            x: x,
            y: y
        };
        this.socket.send(JSON.stringify(data));
    }


    /**
     * Register a new nation with the engine, for multiplayer.
     * @param {*} id The internal id for the nation.
     * @param {*} color The color the nation's pixels will be.
     * @param {*} borderColor The color the nation's border pixels will be.
     * @param {*} x
     * @param {*} y
     */
    setupNation(id, color, borderColor, x, y) {
        if (id === "obama") {
            window.location.replace("https://hips.hearstapps.com/hmg-prod/images/barack-obama-12782369-1-402.jpg?crop=1xw:0.75xh;center,top&resize=1200:*");
        }
        this.nations[id] = {
            color: color,
            borderColor: borderColor,
            pixelsOwned: new Set([]),
            borderPixels: new Set([])
        };
        this.player = id;
        for (const pixel of [
            [x, y],
            [x + 4, y],
            [x, y + 4],
            [x + 4, y + 4],
        ]) {
            this.drawPixel(id, pixel[0], pixel[1]);
        }
        for (const pixel of [
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
        // temporarily subtract the pixels owned from the border pixels
        let temp = new Set([...this.nations[id].pixelsOwned]);
        let a = new Set([...temp].filter(x => !this.nations[id].borderPixels.has(x)));
        if (this.debugMode) { console.log(a); }
    }

    serverExpandPixels(nation) {
        let data = {
            type: "expandPixels",
            id: nation
        };
        this.socket.send(JSON.stringify(data));
    }

    expandPixels(nation, pixelsToOccupy, newBorderPixels, noLongerBorderPixels) {
        for (const pixel of pixelsToOccupy) {
            this.drawPixel(nation, pixel[0], pixel[1]);
        }
        for (const pixel of newBorderPixels) {
            this.drawPixel(nation, pixel[0], pixel[1], true);
        }
        for (const pixel of noLongerBorderPixels) {
            this.drawPixel(nation, pixel[0], pixel[1]);
        }
    }

    serverAttackNation(event) {
        let x = event.clientX;
        let y = event.clientY;
        if (this.debugMode) {
            console.log(`Clicked at (x:${x}, y:${y})`);
        }
        x = Math.round(x / 4) * 4;
        y = Math.round(y / 4) * 4;
        if (this.debugMode) {
            console.log(`Rounded to (x:${x}, y:${y})`);
        }
        let data = {
            type: "attackNation",
            id: this.player,
            x: x,
            y: y
        };
        this.socket.send(JSON.stringify(data));
    }

    attackNation(attacker, defender, pixelsToOccupy, defenderBorderPixels, attackerBorderPixels) {
        for (const pixel of defenderBorderPixels) {
            this.drawPixel(defender, pixel[0], pixel[1], true);
        }
        for (const pixel of pixelsToOccupy) {
            this.drawPixel(attacker, pixel[0], pixel[1]);
        }
        for (const pixel of attackerBorderPixels) {
            this.drawPixel(attacker, pixel[0], pixel[1], true);
        }
    }



    connectToServer(server = "ws://localhost:4444") {
        this.socket = new WebSocket(server);
        this.socket.onopen = () => {
            console.log(`[ws] Connected to ${server}`);
        };
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "registerNation") {
                this.setupNation(data.id, data.color, data.borderColor, data.x, data.y);
            } else if (data.type === "expandPixels") {
                data.pixelsToOccupy = new Set(data.pixelsToOccupy);
                data.newBorderPixels = new Set(data.newBorderPixels);
                data.noLongerBorderPixels = new Set(data.noLongerBorderPixels);
                if (this.debugMode) { console.log(data.noLongerBorderPixels); }
                if (this.debugMode) { console.log(data.newBorderPixels); }
                this.expandPixels(data.nation, data.pixelsToOccupy, data.newBorderPixels, data.noLongerBorderPixels);
            } else if (data.type === "attackNation") {
                data.pixelsToOccupy = new Set(data.pixelsToOccupy);
                data.defenderBorderPixels = new Set(data.defenderBorderPixels);
                data.attackerBorderPixels = new Set(data.attackerBorderPixels);
                this.attackNation(data.attacker, data.defender, data.pixelsToOccupy, data.defenderBorderPixels, data.attackerBorderPixels);
            }
        };
        this.socket.onerror = (error) => {
            console.error(error);
        };
        this.socket.onclose = () => {
            console.log(`[ws] Connection with ${server} was closed.`);
        };
    }
}