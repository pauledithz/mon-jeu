const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 12, paddleHeight = 100, ballSize = 12;
let leftPaddle = { x: 20, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight, speed: 0 };
let rightPaddle = { x: canvas.width - 20 - paddleWidth, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight, speed: 5 };
let ball = {
    x: canvas.width/2 - ballSize/2,
    y: canvas.height/2 - ballSize/2,
    size: ballSize,
    speed: 5,
    dx: 5 * (Math.random() > 0.5 ? 1 : -1),
    dy: 5 * (Math.random() > 0.5 ? 1 : -1)
};

// Draw functions
function drawRect(x, y, w, h, color='#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color='#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    for(let i = 0; i < canvas.height; i += 25) {
        drawRect(canvas.width/2 - 2, i, 4, 15, '#fff5');
    }
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNet();
    // Left paddle
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    // Right paddle
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    // Ball
    drawCircle(ball.x + ball.size/2, ball.y + ball.size/2, ball.size/2);
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height/2;

    // Keep paddle in bounds
    if(leftPaddle.y < 0) leftPaddle.y = 0;
    if(leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;
});

// Collision detection
function collision(p, b) {
    return (
        b.x < p.x + p.width &&
        b.x + b.size > p.x &&
        b.y < p.y + p.height &&
        b.y + b.size > p.y
    );
}

// Reset ball
function resetBall() {
    ball.x = canvas.width/2 - ball.size/2;
    ball.y = canvas.height/2 - ball.size/2;
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
}

// AI for right paddle
function moveRightPaddle() {
    let paddleCenter = rightPaddle.y + rightPaddle.height/2;
    if (ball.y + ball.size/2 < paddleCenter - 10) {
        rightPaddle.y -= rightPaddle.speed;
    } else if (ball.y + ball.size/2 > paddleCenter + 10) {
        rightPaddle.y += rightPaddle.speed;
    }
    // Keep paddle in bounds
    if(rightPaddle.y < 0) rightPaddle.y = 0;
    if(rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/bottom wall collision
    if(ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy *= -1;
    }

    // Left paddle collision
    if(collision(leftPaddle, ball)) {
        ball.dx *= -1;
        // Add a bit of randomness to bounce
        let collidePoint = (ball.y + ball.size/2) - (leftPaddle.y + leftPaddle.height/2);
        collidePoint = collidePoint / (leftPaddle.height/2);
        let angleRad = collidePoint * (Math.PI/4);
        ball.dy = ball.speed * Math.sin(angleRad);
        ball.dx = ball.speed * Math.cos(angleRad);
        if (ball.dx > 0) ball.dx *= -1;
    }

    // Right paddle collision
    if(collision(rightPaddle, ball)) {
        ball.dx *= -1;
        let collidePoint = (ball.y + ball.size/2) - (rightPaddle.y + rightPaddle.height/2);
        collidePoint = collidePoint / (rightPaddle.height/2);
        let angleRad = collidePoint * (Math.PI/4);
        ball.dy = ball.speed * Math.sin(angleRad);
        ball.dx = -ball.speed * Math.cos(angleRad);
        if (ball.dx < 0) ball.dx *= -1;
    }

    // Left/right wall (reset ball)
    if(ball.x <= 0 || ball.x + ball.size >= canvas.width) {
        resetBall();
    }

    moveRightPaddle();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();