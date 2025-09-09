document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameRunning = true;
    let scrollSpeed = 2; // Speed of background scrolling
    let score = 0; // ✅ Score variable

    // Load the background image
    const backgroundImage = new Image();
    backgroundImage.src = "assets/game_background_tiled.png"; 

    let backgroundY1 = 0;
    let backgroundY2 = -canvas.height;

    backgroundImage.onload = () => {
        const playerImage = new Image();
        playerImage.src = "assets/player_bird.png"; 
        let player = {
            x: canvas.width / 2 - 48,
            y: canvas.height - 140,
            width: 140,
            height: 100,
            speed: 5
        };

        let keys = {};
        document.addEventListener('keydown', (e) => { keys[e.key] = true; });
        document.addEventListener('keyup', (e) => { keys[e.key] = false; });

        function updatePlayer() {
            if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
            if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
            if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
            if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;
        }

        // Bullets
        let bullets = [];
        const bulletImage = new Image();
        bulletImage.src = "assets/bullet_fireball.png"; 

        function shoot() {
            bullets.push({
                x: player.x + player.width / 2 - 18,
                y: player.y,
                width: 64,
                height: 64,
                speed: 7
            });
        }

        let lastShotTime = 0;
        const shotDelay = 200;

        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && (Date.now() - lastShotTime > shotDelay)) {
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

        // Enemies
        let enemies = [];
        const enemyImage = new Image();
        enemyImage.src = "assets/enemy_aswang.png"; 

        function spawnEnemy() {
            enemies.push({
                x: Math.random() * (canvas.width - 64),
                y: -100,
                width: 100,
                height: 100,
                speed: 1 + Math.random() * 2
            });
        }

        let lastEnemySpawnTime = 0;
        const enemySpawnDelay = 1500;

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
        // Collision detection
        function checkCollisions() {
            // Helper: scaled collision check
            function checkCollisionScaled(p, e, scale = 0.8) {
                let pWidth = p.width * scale;
                let pHeight = p.height * scale;
                let eWidth = e.width * scale;
                let eHeight = e.height * scale;

                let pX = p.x + (p.width - pWidth) / 2;
                let pY = p.y + (p.height - pHeight) / 2;
                let eX = e.x + (e.width - eWidth) / 2;
                let eY = e.y + (e.height - eHeight) / 2;

                return !(pX + pWidth < eX || 
                        pX > eX + eWidth || 
                        pY + pHeight < eY || 
                        pY > eY + eHeight);
            }

            // 🔹 Bullet-enemy collisions
            for (let i = 0; i < bullets.length; i++) {
                for (let j = 0; j < enemies.length; j++) {
                    if (checkCollisionScaled(bullets[i], enemies[j], 0.9)) { 
                        // ✅ Increase score
                        score += 10;

                        bullets.splice(i, 1);
                        enemies.splice(j, 1);
                        i--; 
                        j--; 
                        break;
                    }
                }
            }

            // 🔹 Player-enemy collisions
            for (let i = 0; i < enemies.length; i++) {
                if (checkCollisionScaled(player, enemies[i], 0.8)) { // Player hitbox is slightly smaller
                    gameRunning = false;

                    // ✅ Show modal with score
                    document.getElementById("gameOverModal").style.display = "block";
                    document.getElementById("finalScore").textContent = "Your Score: " + score;
                    document.getElementById("gameOverModal").style.display = "block";
                }
            }
        }


        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(backgroundImage, 0, backgroundY1, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, backgroundY2, canvas.width, canvas.height);

            backgroundY1 += scrollSpeed;
            backgroundY2 += scrollSpeed;

            if (backgroundY1 > canvas.height) backgroundY1 = -canvas.height + (backgroundY1 - canvas.height);
            if (backgroundY2 > canvas.height) backgroundY2 = -canvas.height + (backgroundY2 - canvas.height);

            ctx.drawImage(playerImage, player.x, player.y + 25, player.width, player.height);

            bullets.forEach(bullet => { 
                ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
            });

            enemies.forEach(enemy => {
                ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
            });

            // ✅ Draw score on screen
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.fillText("Score: " + score, 20, 40);
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

        // ✅ Restart function (called by button in modal)
        window.restartGame = function() {
            score = 0;
            bullets = [];
            enemies = [];
            gameRunning = true;
            document.getElementById("gameOverModal").style.display = "none";
            gameLoop();
        };
    };
});
