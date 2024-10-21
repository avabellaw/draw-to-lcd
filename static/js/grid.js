
document.addEventListener('DOMContentLoaded', () => {
    let isMouseDown = false;
    const grid = document.getElementById('grid');
    grid.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        toggleCell(event.target);
    });

    grid.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    grid.addEventListener('mouseover', (event) => {
        if (isMouseDown) {
            toggleCell(event.target);
        }
    });

    async function toggleCell(cell) {
        const x = cell.getAttribute('data-x');
        const y = cell.getAttribute('data-y');
        cell.classList.toggle('filled');
        await sendData(x, y);
    }       

    async function sendData(x, y) {
        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ x: x, y: y }),
            });
            const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    }
});