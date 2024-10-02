window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Resizing
    canvas.height = window.innerHeight - this.window.innerHeight / 4;
    canvas.width = window.innerWidth - this.window.innerWidth / 4;

    // Variables
    let painting = false;
    let lineWidth = 10;
    let lineCap = 'round';
    let backgroundColor = 'white';
    let paths = []; // To store drawn paths for redrawing after background change
    let currentPath = [];

    // Function to draw the current canvas background
    function drawBackground() {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Function to redraw existing paths
    function redrawPaths() {
        paths.forEach(path => {
            ctx.lineWidth = path.lineWidth;
            ctx.lineCap = path.lineCap;
            ctx.strokeStyle = path.strokeStyle;
            ctx.beginPath();
            for (let i = 0; i < path.points.length; i++) {
                const point = path.points[i];
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
        });
    }

    // Function to save the current path
    function saveCurrentPath() {
        paths.push({
            points: [...currentPath], // Save the current drawn points
            lineWidth: lineWidth,
            lineCap: lineCap,
            strokeStyle: ctx.strokeStyle,
        });
    }

    function startPosition(x, y) {
        painting = true;
        currentPath = []; // Start a new path
        draw(x, y);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
        saveCurrentPath(); // Save the path after finishing
    }

    function draw(x, y) {
        if (!painting) return;

        currentPath.push({ x, y }); // Add current point to the path
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Mouse Event Listeners
    canvas.addEventListener('mousedown', (e) => startPosition(e.clientX, e.clientY));
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', (e) => draw(e.clientX, e.clientY));

    // Touch Event Listeners for mobile devices
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent scrolling when drawing
        const touch = e.touches[0]; // Get the first touch point
        startPosition(touch.clientX, touch.clientY);
    });
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        finishedPosition();
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        draw(touch.clientX, touch.clientY);
    });

    // Clear canvas
    const clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths = []; // Clear the saved paths
        drawBackground(); // Redraw the background
    });

    // Save canvas
    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', () => {
        const dataURL = canvas.toDataURL();
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'image.png';
        a.click();
    });

    // Change color
    const colorButtons = document.querySelectorAll('.color');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            ctx.strokeStyle = button.style.backgroundColor;
        });
    });

    // Change size
    const sizeRange = document.getElementById('size');
    sizeRange.addEventListener('input', () => {
        lineWidth = sizeRange.value;
    });

    // Change background color
    const backgroundButtons = document.querySelectorAll('.background');
    backgroundButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update the background color
            backgroundColor = button.style.backgroundColor;
            
            // Clear and redraw the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground(); // Draw the new background
            redrawPaths(); // Redraw all the paths on top of the new background
        });
    });

    // Change shape
    const shapeButtons = document.querySelectorAll('.shape');
    shapeButtons.forEach(button => {
        button.addEventListener('click', () => {
            lineCap = button.id;
        });
    });

    // Change opacity
    const opacityRange = document.getElementById('opacity');
    opacityRange.addEventListener('input', () => {
        ctx.globalAlpha = opacityRange.value;
    });

    // Draw the initial background
    drawBackground();
});
