
document.addEventListener('DOMContentLoaded', () => {
    class Square {
        static colours = {
            0: "black",
            1: "rgb(136, 136, 136)",
            2: "rgb(144.5, 144.5, 144.5)",
            3: "rgb(153, 153, 153)",
            4: "rgb(161.5, 161.5, 161.5)",
            5: "rgb(170, 170, 170)",
            6: "rgb(178.5, 178.5, 178.5)",
            7: "rgb(187, 187, 187)",
            8: "rgb(195.5, 195.5, 195.5)",
            9: "rgb(204, 204, 204)",
            10: "rgb(212.5, 212.5, 212.5)",
            11: "rgb(221, 221, 221)",
            12: "rgb(229.5, 229.5, 229.5)",
            13: "rgb(238, 238, 238)",
            14: "rgb(246.5, 246.5, 246.5)",
            15: "rgb(255, 255, 255)"
        }

        constructor(x, y, size, context) {
            this.x = x;
            this.y = y;
            this.size = size;
            
            context.fillStyle = "black";
            context.fillRect(this.x, this.y, this.size, this.size);
        }

        setColour = (colour) => {
            context.fillStyle = Square.colours[colour];
            context.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d")
    const pixelCount = 128;
    const pixelSize = 10;
    let penColour = 15;

    grid = [pixelCount];

    canvas.width = pixelCount * pixelSize + pixelCount + 1;
    canvas.height = pixelCount * pixelSize + pixelCount + 1;
    context.fillStyle = "gray";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pixelCount; i++) {
        row = [pixelCount];
        for (let j = 0; j < pixelCount; j++) {
            row.push(new Square(i * pixelSize + i + 1, j * pixelSize + j + 1, pixelSize, context));
        }

        grid.push(row); 
    }

    // Event listeners
    canvas.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        getSquare(e).setColour(penColour);
    });

    canvas.addEventListener('mouseup', (e) => {
        isMouseDown = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isMouseDown) {
            getSquare(e).setColour(penColour);
        }
    });

    function getSquare(event){
        const x = Math.floor(event.clientX / (pixelSize + 1));
        const y = Math.floor(event.clientY / (pixelSize + 1));
        return grid[x][y];
    }


    // let isMouseDown = false;
    // let colour = 15;
    
    // const grid = document.getElementById('grid');
    // const clearButton = document.getElementById('clear');

    // // Event handlers
    // const handleMouseDown = (event) => {
    //     isMouseDown = true;
    //     setCell(event.target);
    // }

    // const handleMouseUp = () => { isMouseDown = false; }

    // const handleMouseOver = (event) => {
    //     if (isMouseDown) {
    //         setCell(event.target);
    //     }
    // }  

    // async function handleClearButtonClick() {
    //     const cells = document.querySelectorAll('.filled');
    //     cells.forEach(cell => {
    //         cell.classList.remove('filled');
    //     });
    //     await clearData();
    // }

    // // Add event listeners
    // grid.addEventListener('mousedown', handleMouseDown );
    // grid.addEventListener('mouseup', handleMouseUp);
    // grid.addEventListener('mouseover', handleMouseOver);
    // clearButton.addEventListener('click', handleClearButtonClick);
    // document.addEventListener('click', function (event) {
    //     if (event.target && event.target.matches("input[type='radio']")) {
    //         colour = event.target.value;
    //     }
    // }, false);

    // async function clearData() {
    //    await sendData(JSON.stringify({}), 'clear');
    // }

    // async function setCell(cell) {
    //     const x = cell.getAttribute('data-x');
    //     const y = cell.getAttribute('data-y');
    //     cell.dataset.colour = colour;
    //     await sendPixelData(x, y, colour);
    // }    

    // async function sendPixelData(x, y, colour) {
    //     sendData({ x: x, y: y, colour: colour}, "submit");
    // }

    // async function sendData(message, controller){
    //     try {
    //         const response = await fetch(`/${controller}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(message),
    //         });
    //         const data = await response.json();
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    // // Clean up event listeners when the window is unloaded
    // window.addEventListener('unload', () => {
    //     grid.removeEventListener('mousedown', handleMouseDown);
    //     grid.removeEventListener('mouseup', handleMouseUp);
    //     grid.removeEventListener('mouseover', handleMouseOver);
    //     clearButton.removeEventListener('click', clearData);
    // });
});