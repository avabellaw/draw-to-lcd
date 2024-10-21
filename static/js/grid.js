
document.addEventListener('DOMContentLoaded', () => {
    let isMouseDown = false;
    
    const grid = document.getElementById('grid');
    const clearButton = document.getElementById('clear');

    // Event handlers
    const handleMouseDown = (event) => {
        isMouseDown = true;
        toggleCell(event.target);
    }

    const handleMouseUp = () => { isMouseDown = false; }

    const handleMouseOver = (event) => {
        if (isMouseDown) {
            toggleCell(event.target);
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

    async function clearData() {
       await sendData(JSON.stringify({}), 'clear');
    }

    async function toggleCell(cell) {
        const x = cell.getAttribute('data-x');
        const y = cell.getAttribute('data-y');
        cell.classList.toggle('filled');
        await sendPixelData(x, y);
    }    

    async function sendPixelData(x, y) {
        sendData({ x: x, y: y }, "submit");
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