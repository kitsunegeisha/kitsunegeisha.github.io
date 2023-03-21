const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundImage = new Image();
backgroundImage.src = "Sprites/star.png";

let backgroundX = 0;
let backgroundSpeed = 1;

function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

  backgroundX -= backgroundSpeed;
  if (backgroundX <= -canvas.width) {
    backgroundX = 0;
  }
}


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
        this.level = 1; // Add a level property
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // Draw the image instead of a rectangle
    }

    update() {
        this.x -= this.speed;
        this.shootCounter++;
        if (this.shootCounter > this.shootCooldown / this.level) { // Adjust the shootCooldown based on level
            this.shoot();
            this.shootCounter = 0;
        }
        if (score >= this.level * 1000) { // Increase the level based on the score
            this.level++;
            this.speed++;
        }
    }

    shoot() {
        const bulletX = this.x - 5;
        const bulletY = this.y + this.height / 2;
        const bullet = new Bullet(bulletX, bulletY);
        bullet.speed = -(3 + this.level); // Increase the speed of the bullets based on level
        bullets.push(bullet);

        if (this.level >= 2) { // Fire more bullets at higher levels
            const bulletX2 = this.x - 5;
            const bulletY2 = this.y + this.height / 2 - 5;
            const bullet2 = new Bullet(bulletX2, bulletY2);
            bullet2.speed = -(3 + this.level);
            bullets.push(bullet2);

            const bulletX3 = this.x - 5;
            const bulletY3 = this.y + this.height / 2 + 5;
            const bullet3 = new Bullet(bulletX3, bulletY3);
            bullet3.speed = -(3 + this.level);
            bullets.push(bullet3);
        }
    }
}

class FastEnemy extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.width = 20;
    this.height = 20;
    this.speed = 3;
    this.health = 50;
    this.image.src = "Sprites/swoop02.png";
  }
}

class TankEnemy extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.width = 30;
    this.height = 30;
    this.speed = 0.5;
    this.health = 200;
    this.image.src = "Sprites/swoop01.png";
  }
}

class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.type = type;
    this.image = new Image();

    switch (type) {
      case 'health':
        this.image.src = "Sprites/ship_pink.png";
        break;
      // Add other power-up types here
    }
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= 1;
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
    ctx.fillStyle = "#a20001";
    ctx.font = "100px Roboto";
    ctx.fillText("Game Over!", 140, 300);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ff0d00";
    ctx.strokeText("Game Over!", 140, 300);
}
  
function spawnEnemy() {
  const enemyY = Math.random() * (canvas.height - 20);
  const enemyType = Math.floor(Math.random() * 3);
  let enemy;

  switch (enemyType) {
    case 0:
      enemy = new Enemy(canvas.width, enemyY);
      break;
    case 1:
      enemy = new FastEnemy(canvas.width, enemyY);
      break;
    case 2:
      enemy = new TankEnemy(canvas.width, enemyY);
      break;
  }

  enemy.level = Math.floor(score / 1000) + 1;
  enemies.push(enemy);

  setTimeout(spawnEnemy, 2000);
  }
  
spawnEnemy();


const powerUps = [];

function spawnPowerUp() {
  const powerUpY = Math.random() * (canvas.height - 20);
  const powerUpType = 'health'; // You can add more power-up types and use random selection
  const powerUp = new PowerUp(canvas.width, powerUpY, powerUpType);
  powerUps.push(powerUp);

  // Spawn power-ups at random intervals between 5 and 15 seconds
  setTimeout(spawnPowerUp, Math.random() * 10000 + 5000);
}

spawnPowerUp();


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
  // Draw the background first
  drawBackground();
 

//ctx.clearRect(0, 0, canvas.width, canvas.height);

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

// enemies.forEach((enemy, index) => {
//     enemy.update();
//     enemy.draw();

//     // Remove enemies that are off the canvas
//     if (enemy.x < 0) {
//     enemies.splice(index, 1);
//     }
// });

enemies.forEach((enemy, index) => {
  enemy.update();
  enemy.draw();

  // Check for collision between spaceship and enemy
  if (checkCollision(spaceShip, enemy)) {
    // Decrease spaceship health
    spaceShip.health -= 20;
    updateHealth();

    // Remove the enemy after the collision
    enemies.splice(index, 1);

    // Check if the spaceship's health is depleted, and end the game if it is
    if (spaceShip.health <= 0) {
      gameOver();
    }
  }

  // Remove enemies that are off the canvas
  if (enemy.x < 0) {
    enemies.splice(index, 1);
  }
});

  // ...
  powerUps.forEach((powerUp, index) => {
    powerUp.update();
    powerUp.draw();

    // Check for collision with the spaceship
    if (checkCollision(powerUp, spaceShip)) {
      switch (powerUp.type) {
        case 'health':
          spaceShip.health = Math.min(spaceShip.health + 20, 100);
          updateHealth();
          break;
        // Add other power-up effects here
      }

      // Remove the power-up after it's collected
      powerUps.splice(index, 1);
    }

    // Remove power-ups that are off the canvas
    if (powerUp.x < 0) {
      powerUps.splice(index, 1);
    }
  });

requestAnimationFrame(gameLoop);
}


//gameLoop();
backgroundImage.addEventListener('error', function (event) {
  console.error('Error loading the background image:', event);
});
backgroundImage.addEventListener('load', gameLoop);


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
