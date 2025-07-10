const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const width = 40;
const height = 20;
const scale = 20; // scale for visual size

let gameOver = false;
let x = Math.floor(width / 2);
let y = Math.floor(height / 2);
let fruitX = Math.floor(Math.random() * (width - 2)) + 1;
let fruitY = Math.floor(Math.random() * (height - 2)) + 1;
let score = 0;

let dir = ""; // '', 'LEFT', 'RIGHT', 'UP', 'DOWN'
let tail = [];
let tailLength = 0;

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, y * scale, scale, scale);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width * scale, height * scale);

    // Draw borders
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width * scale, height * scale);

    // Draw fruit
    drawBlock(fruitX, fruitY, "red");

    // Draw head
    drawBlock(x, y, "lime");

    // Draw tail
    tail.forEach(segment => drawBlock(segment[0], segment[1], "green"));

    // Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, height * scale + 25);
}

function update() {
    if (gameOver) return;

    // Tail logic
    if (tail.length > 0) {
        tail.unshift([x, y]);
        if (tail.length > tailLength) tail.pop();
    }

    // Move
    switch (dir) {
        case "LEFT": x--; break;
        case "RIGHT": x++; break;
        case "UP": y--; break;
        case "DOWN": y++; break;
    }

    // Collision with wall
    if (x < 0 || x >= width || y < 0 || y >= height) {
        gameOver = true;
        return;
    }

    // Collision with self
    for (let segment of tail) {
        if (segment[0] === x && segment[1] === y) {
            gameOver = true;
            return;
        }
    }

    // Eat fruit
    if (x === fruitX && y === fruitY) {
        score += 10;
        fruitX = Math.floor(Math.random() * (width - 2)) + 1;
        fruitY = Math.floor(Math.random() * (height - 2)) + 1;
        tailLength++;
    }

    draw();
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "a":
        case "ArrowLeft":
            if (dir !== "RIGHT") dir = "LEFT";
            break;
        case "d":
        case "ArrowRight":
            if (dir !== "LEFT") dir = "RIGHT";
            break;
        case "w":
        case "ArrowUp":
            if (dir !== "DOWN") dir = "UP";
            break;
        case "s":
        case "ArrowDown":
            if (dir !== "UP") dir = "DOWN";
            break;
        case "x":
            gameOver = true;
            break;
    }
});

function gameLoop() {
    if (!gameOver) {
        update();
        setTimeout(gameLoop, 100); // control speed
    } else {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", 100, height * scale / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Final Score: " + score, 110, height * scale / 2 + 30);
    }
}

draw();
gameLoop();
