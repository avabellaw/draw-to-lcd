
document.addEventListener('DOMContentLoaded', () => {
    let isMouseDown = false;
    let colour = 15;
    
    const grid = document.getElementById('grid');
    const clearButton = document.getElementById('clear');

    // Event handlers
    const handleMouseDown = (event) => {
        isMouseDown = true;
        setCell(event.target);
    }

    const handleMouseUp = () => { isMouseDown = false; }

    const handleMouseOver = (event) => {
        if (isMouseDown) {
            setCell(event.target);
        }
    }  

    async function handleClearButtonClick() {
        const cells = document.querySelectorAll('.filled');
        cells.forEach(cell => {
            cell.classList.remove('filled');
        });
        await clearData();
    }

    // Add event listeners
    grid.addEventListener('mousedown', handleMouseDown );
    grid.addEventListener('mouseup', handleMouseUp);
    grid.addEventListener('mouseover', handleMouseOver);
    clearButton.addEventListener('click', handleClearButtonClick);
    document.addEventListener('click', function (event) {
        if (event.target && event.target.matches("input[type='radio']")) {
            colour = event.target.value;
        }
    }, false);

    async function clearData() {
       await sendData(JSON.stringify({}), 'clear');
    }

    async function setCell(cell) {
        const x = cell.getAttribute('data-x');
        const y = cell.getAttribute('data-y');
        cell.dataset.colour = colour;
        await sendPixelData(x, y, colour);
    }    

    async function sendPixelData(x, y, colour) {
        sendData({ x: x, y: y, colour: colour}, "submit");
    }

    async function sendData(message, controller){
        try {
            const response = await fetch(`/${controller}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
            const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Clean up event listeners when the window is unloaded
    window.addEventListener('unload', () => {
        grid.removeEventListener('mousedown', handleMouseDown);
        grid.removeEventListener('mouseup', handleMouseUp);
        grid.removeEventListener('mouseover', handleMouseOver);
        clearButton.removeEventListener('click', clearData);
    });
});