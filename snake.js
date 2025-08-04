// Get the canvas and its drawing context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Set the size of each grid cell
const gridSize = 20;

// Initialize the snake with one segment at the center
let snake = [{ x: 200, y: 200 }];

// Set the initial movement direction (moving right)
let direction = { x: gridSize, y: 0 };

// Food position
let food = { x: 0, y: 0 };

// Player's score
let score = 0;

// Game over flag
let gameOver = false;

// Array to hold obstacle positions
let obstacles = [];

// Function to place obstacles randomly
function placeObstacles(count = 5) {
  obstacles = [];
  while (obstacles.length < count) {
    let pos = randomPosition();
    // Avoid placing on snake or food or other obstacles
    if (
      !snake.some(segment => segment.x === pos.x && segment.y === pos.y) &&
      !(food.x === pos.x && food.y === pos.y) &&
      !obstacles.some(ob => ob.x === pos.x && ob.y === pos.y)
    ) {
      obstacles.push(pos);
    }
  }
}

// Generate a random position for food within the grid
function randomPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
}

// Update placeFood to avoid obstacles
function placeFood() {
  food = randomPosition();
  while (
    snake.some(segment => segment.x === food.x && segment.y === food.y) ||
    obstacles.some(ob => ob.x === food.x && ob.y === food.y)
  ) {
    food = randomPosition();
  }
}

// Draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw obstacles
  ctx.fillStyle = 'red';
  obstacles.forEach(ob => ctx.fillRect(ob.x, ob.y, gridSize, gridSize));

  // Draw the snake with rounded corners
  ctx.fillStyle = 'deepskyblue';
  snake.forEach((segment, i) => {
    ctx.globalAlpha = i === 0 ? 1 : 0.7; // Head is brighter
    ctx.beginPath();
    ctx.moveTo(segment.x + 4, segment.y);
    ctx.lineTo(segment.x + gridSize - 4, segment.y);
    ctx.quadraticCurveTo(segment.x + gridSize, segment.y, segment.x + gridSize, segment.y + 4);
    ctx.lineTo(segment.x + gridSize, segment.y + gridSize - 4);
    ctx.quadraticCurveTo(segment.x + gridSize, segment.y + gridSize, segment.x + gridSize - 4, segment.y + gridSize);
    ctx.lineTo(segment.x + 4, segment.y + gridSize);
    ctx.quadraticCurveTo(segment.x, segment.y + gridSize, segment.x, segment.y + gridSize - 4);
    ctx.lineTo(segment.x, segment.y + 4);
    ctx.quadraticCurveTo(segment.x, segment.y, segment.x + 4, segment.y);
    ctx.closePath();
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Draw the food
  ctx.fillStyle = 'lime';
  ctx.beginPath();
  ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw the score
  ctx.fillStyle = '#fffbe7';
  ctx.font = '18px Arial';
  ctx.fillText('Score: ' + score, 10, canvas.height - 10);

  // If game over, display message
  if (gameOver) {
    ctx.fillStyle = 'yellow';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over!', 80, canvas.height / 2);
  }
}

// Move the snake and handle game logic
function moveSnake() {
  if (gameOver) return;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap snake position if it goes through walls
  if (head.x < 0) head.x = canvas.width - gridSize;
  else if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - gridSize;
  else if (head.y >= canvas.height) head.y = 0;

  // Check collision with itself
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver = true;
    return;
  }

  // Check collision with obstacles
  if (obstacles.some(ob => ob.x === head.x && ob.y === head.y)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    placeFood();
  } else {
    snake.pop();
  }
}

// Listen for keyboard events to change direction
document.addEventListener('keydown', e => {
  if (gameOver) return;
  switch (e.key) {
    case 'ArrowUp':
      // Prevent reversing direction
      if (direction.y === 0) direction = { x: 0, y: -gridSize };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: gridSize };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -gridSize, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: gridSize, y: 0 };
      break;
  }
});

// Main game loop
function gameLoop() {
  moveSnake();
  draw();
  // Continue the loop if game is not over
  if (!gameOver) {
    setTimeout(gameLoop, 100);
  }
}

// Start the game by placing obstacles, food, and running the loop
placeObstacles(5); // You can change the number of obstacles
placeFood();
gameLoop();
