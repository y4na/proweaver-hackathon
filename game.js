document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameRunning = true;
    let scrollSpeed = 2; // Speed of background scrolling

    // Load the background image
    const backgroundImage = new Image();
    // This image needs to be tiled
    backgroundImage.src = "assets/game_background_tiled.png"; 

    let backgroundY1 = 0;
    let backgroundY2 = -canvas.height; // Start the second image above the canvas

    backgroundImage.onload = () => {
        // Player (Inspired by a mythological bird like Sarimanok or a spirit)
        const playerImage = new Image();
        playerImage.src = "assets/player_bird.png"; // You'll need to create this image
        let player = {
            x: canvas.width / 2 - 48, // Assuming player is 64x64
            y: canvas.height - 140,
            width: 140,
            height: 100,
            speed: 5
        };

        // Player movement
        let keys = {};
        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });
        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        function updatePlayer() {
            if (keys['ArrowLeft'] && player.x > 0) {
                player.x -= player.speed;
            }
            if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
                player.x += player.speed;
            }
            if (keys['ArrowUp'] && player.y > 0) {
                player.y -= player.speed;
            }
            if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
                player.y += player.speed;
            }
        }

        // Bullets (e.g., enchanted arrows, fireballs from a diwata)
        let bullets = [];
        const bulletImage = new Image();
        bulletImage.src = "assets/bullet_fireball.png"; // You'll need to create this image

        function shoot() {
            bullets.push({
                x: player.x + player.width / 2 - 18, // Center bullet
                y: player.y,
                width: 64,
                height: 64,
                speed: 7
            });
        }

        let lastShotTime = 0;
        const shotDelay = 200; // milliseconds between shots

        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && (Date.now() - lastShotTime > shotDelay)) { // Spacebar to shoot
                shoot();
                lastShotTime = Date.now();
            }
        });

        function updateBullets() {
            for (let i = 0; i < bullets.length; i++) {
                bullets[i].y -= bullets[i].speed;
                if (bullets[i].y < 0) {
                    bullets.splice(i, 1);
                    i--;
                }
            }
        }

        // Enemies (e.g., Aswang, Kapre, Tikbalang, distorted spirits)
        let enemies = [];
        const enemyImage = new Image();
        enemyImage.src = "assets/enemy_aswang.png"; 

        function spawnEnemy() {
            enemies.push({
                x: Math.random() * (canvas.width - 64),
                y: -100, // Start above canvas
                width: 100,
                height: 100,
                speed: 1 + Math.random() * 2 // Random speed
            });
        }

        let lastEnemySpawnTime = 0;
        const enemySpawnDelay = 1500; // milliseconds between enemy spawns

        function updateEnemies() {
            if (Date.now() - lastEnemySpawnTime > enemySpawnDelay) {
                spawnEnemy();
                lastEnemySpawnTime = Date.now();
            }

            for (let i = 0; i < enemies.length; i++) {
                enemies[i].y += enemies[i].speed;
                if (enemies[i].y > canvas.height) {
                    enemies.splice(i, 1);
                    i--;
                }
            }
        }

        // Collision detection
        function checkCollisions() {
            for (let i = 0; i < bullets.length; i++) {
                for (let j = 0; j < enemies.length; j++) {
                    // Simple AABB collision
                    if (bullets[i].x < enemies[j].x + enemies[j].width &&
                        bullets[i].x + bullets[i].width > enemies[j].x &&
                        bullets[i].y < enemies[j].y + enemies[j].height &&
                        bullets[i].y + bullets[i].height > enemies[j].y) {
                        
                        // Collision detected! Remove bullet and enemy
                        bullets.splice(i, 1);
                        enemies.splice(j, 1);
                        i--; // Adjust index after removing bullet
                        j--; // Adjust index after removing enemy
                        // Add score, sound, effects here
                        break; // No need to check this bullet against other enemies
                    }
                }
            }

            // Player-enemy collision (for losing condition)
            for (let i = 0; i < enemies.length; i++) {
                if (player.x < enemies[i].x + enemies[i].width &&
                    player.x + player.width > enemies[i].x &&
                    player.y < enemies[i].y + enemies[i].height &&
                    player.y + player.height > enemies[i].y) {
                    
                    // Game Over!
                    console.log("Game Over!");
                    gameRunning = false;
                    // Implement a game over screen or reset
                }
            }
        }


        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw scrolling background
            ctx.drawImage(backgroundImage, 0, backgroundY1, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, backgroundY2, canvas.width, canvas.height);

            backgroundY1 += scrollSpeed;
            backgroundY2 += scrollSpeed;

            if (backgroundY1 > canvas.height) {
                backgroundY1 = -canvas.height + (backgroundY1 - canvas.height);
            }
            if (backgroundY2 > canvas.height) {
                backgroundY2 = -canvas.height + (backgroundY2 - canvas.height);
            }

            // Draw player
            ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

            // Draw bullets
            bullets.forEach(bullet => {
                ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
            });

            // Draw enemies
            enemies.forEach(enemy => {
                ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
            });
        }

        function gameLoop() {
            if (!gameRunning) return;

            updatePlayer();
            updateBullets();
            updateEnemies();
            checkCollisions();
            draw();

            requestAnimationFrame(gameLoop);
        }

        gameLoop();
    };
});