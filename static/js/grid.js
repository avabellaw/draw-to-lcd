
document.addEventListener('DOMContentLoaded', () => {
    const pixelCount = 127;
    const pixelSize = 10;
    let penColour = 15;

    const colours = {
        0: 0x000000, // black
        1: 0x888888,
        2: 0x909090,
        3: 0x999999,
        4: 0xa1a1a1,
        5: 0xaaaaaa,
        6: 0xb2b2b2,
        7: 0xbbbbbb,
        8: 0xc3c3c3,
        9: 0xcccccc,
        10: 0xd4d4d4,
        11: 0xdddddd,
        12: 0xe5e5e5,
        13: 0xeeeeee,
        14: 0xf6f6f6,
        15: 0xffffff
    };

    // Screen size including grid lines 
    const SCREEN_SIZE = pixelCount * pixelSize + pixelCount + 1

    // Create PixiJS application
    const app = new PIXI.Application({
        width: SCREEN_SIZE,
        height: SCREEN_SIZE,
        backgroundColor: 0x808080,
        eventMode: "static",
        eventFeatures: {
            move: true,
            globalMove: false,
            click: true,
            wheel: false,
        }
    });
    document.getElementById("canvas-container").appendChild(app.view);

    // Create and add PIXI.js grid graphics
    const gridGraphics = new PIXI.Graphics();
    app.stage.addChild(gridGraphics);

    // Draw initial squares onto grid
    for (let i = 0; i < pixelCount; i++) {
        for (let j = 0; j < pixelCount; j++) {
            drawSquare(i * pixelSize + i + 1, j * pixelSize + j + 1, 0);
        }
    }

    // Add event listeners
    addEventListeners();

    /**
     * Draws the square using the given x, y coordinates and colour
     * @param {int} x Square x
     * @param {int} y Square y
     * @param {int} colour Square colour
     */
    function drawSquare(x, y, colour) {
        gridGraphics.beginFill(colours[colour]);
        gridGraphics.drawRect(x, y, pixelSize, pixelSize);
        gridGraphics.endFill();
    }

    /**
     * Returns the x and y coordinates of the square that the mouse is currently over
     * @param {*} event The event object to get the global mouse coordinates
     * @returns The coordinates of the target square
     */
    function getSquareXY(event) {
        let x = event.data.global.x;
        let y = event.data.global.y;
        x -= x % (pixelSize + 1) - 1;
        y -= y % (pixelSize + 1) - 1;

        return { x, y };
    }

    /**
     * Function to add PIXI.js mouse event listeners
     */
    function addEventListeners() {
        let isMouseDown = false;
        let prevCoords = { x: null, y: null };

        // app.stage.interactive = true; // v7 version of eventMode = static
        app.stage.hitArea = app.screen;

        app.stage.on('pointerdown', (event) => {
            isMouseDown = true;
            const coords = getSquareXY(event);
            drawSquare(coords.x, coords.y, penColour);
        });

        const mouseClickReleased = () => {
            isMouseDown = false;
            prevCoords = { x: null, y: null };
        }

        app.stage.on('pointerup', () => {
            mouseClickReleased();
        });

        app.stage.on('pointerupoutside', () => {
            mouseClickReleased();
        });

        app.stage.on('pointermove', (event) => {
            if (isMouseDown) {
                const coords = getSquareXY(event);
                if (coords.x !== prevCoords.x || coords.y !== prevCoords.y) {
                    drawSquare(coords.x, coords.y, penColour);
                    prevCoords = coords;
                }
            }
        });
    }    
});