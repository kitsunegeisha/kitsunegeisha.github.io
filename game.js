const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class SpaceShip {
  constructor() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.width = 20;
    this.height = 20;
    this.health = 100; // Add health to the SpaceShip class
    this.image = new Image();
    this.image.src = "Sprites/ship_blue.png"; // Set the image source
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // Draw the image instead of a rectangle
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 2;
    this.speed = 7;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.speed;
  }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 1;
        this.shootCooldown = 100;
        this.shootCounter = 0;
        this.image = new Image();
        this.image.src = "Sprites/enemy_white2.png"; // Set the image source
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // Draw the image instead of a rectangle
    }

    update() {
        this.x -= this.speed;
        this.shootCounter++;
        if (this.shootCounter > this.shootCooldown) {
        this.shoot();
        this.shootCounter = 0;
        }
    }

    shoot() {
        if (score >= 600) {
            const bulletX = this.x - 5;
            const bulletY = this.y + this.height / 2;
            const bullet = new Bullet(bulletX, bulletY);
            bullet.speed = -3;
            bullets.push(bullet);
        }
    }
}

let score = 0;
//let gameRunning = true; // Add a variable to control the game loop

const spaceShip = new SpaceShip();
const bullets = [];
const enemies = [];

function restartGame() {
    score = 0;
    updateScore();
  
    spaceShip.health = 100;
    updateHealth();
  
    bullets.length = 0;
    enemies.length = 0;
  
    document.getElementById('gameOver').style.display = 'none';
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}
  
function updateHealth() {
    document.getElementById('health').innerText = `Health: ${spaceShip.health}`;
} 

function gameOver() {
    //gameRunning = false; // Stop the game loop
    document.getElementById('gameOver').style.display = 'block'; // Show the game over message
}
  
function spawnEnemy() {
    const enemyY = Math.random() * (canvas.height - 20);
    const enemy = new Enemy(canvas.width, enemyY);
    enemies.push(enemy);
  
    setTimeout(spawnEnemy, 2000);
  }
  
spawnEnemy();

// Helper function to check for collisions between two rectangles
function checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

function gameLoop() {
 

ctx.clearRect(0, 0, canvas.width, canvas.height);

spaceShip.draw();

bullets.forEach((bullet, bulletIndex) => {
    bullet.update();
    bullet.draw();

    if (checkCollision(bullet, spaceShip) && bullet.speed < 0) {
        if (spaceShip.health > 0) {
            spaceShip.health -= 10;
            updateHealth();
            bullets.splice(bulletIndex, 1);
      
            if (spaceShip.health <= 0) {
              gameOver();
            }
        }
    }
      // End the game when health is less than or equal to zero
    if (spaceShip.health <= 0) {
        gameOver();
    }

    enemies.forEach((enemy, enemyIndex) => {
    // Check for collision between bullet and enemy
    if (checkCollision(bullet, enemy) && bullet.speed > 0) {
        if (spaceShip.health > 0) {
            // Remove the enemy and bullet upon collision
            enemies.splice(enemyIndex, 1);
            bullets.splice(bulletIndex, 1);
      
            // Increment score and update score display only when the spaceship has health
            score += 100;
            updateScore();
          }
    }
    });

    // Remove bullets that are off the canvas
    if (bullet.x > canvas.width || bullet.x < 0) {
    bullets.splice(bulletIndex, 1);
    }
});

enemies.forEach((enemy, index) => {
    enemy.update();
    enemy.draw();

    // Remove enemies that are off the canvas
    if (enemy.x < 0) {
    enemies.splice(index, 1);
    }
});

requestAnimationFrame(gameLoop);
}


gameLoop();

document.getElementById('restart').addEventListener('click', restartGame);
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
  
    // Allow vertical movement
    spaceShip.y = mouseY - spaceShip.height / 2;
  
    // Limit horizontal movement to half the canvas
    const maxX = canvas.width / 2 - spaceShip.width;
    if (mouseX <= maxX) {
      spaceShip.x = mouseX - spaceShip.width / 2;
    }
  });
  

canvas.addEventListener('click', () => {
  // Create a new bullet and add it to the bullets array
  const bulletX = spaceShip.x + spaceShip.width;
  const bulletY = spaceShip.y + spaceShip.height / 2;
  const bullet = new Bullet(bulletX, bulletY);
  bullets.push(bullet);
});
