// GameScene - Main gameplay
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Add background
        if (this.textures.exists('bg-game')) {
            this.add.image(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, 'bg-game')
                .setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT)
                .setAlpha(0.6);
        }

        // Initialize managers
        this.saveData = this.game.saveData;
        this.currencyManager = new CurrencyManager(this.saveData);
        this.upgradeManager = new UpgradeManager(this.saveData);
        this.waveManager = new WaveManager();

        // Apply permanent upgrades
        const startingCoins = this.upgradeManager.getStartingCoinsBonus();
        this.currencyManager.startRun(startingCoins);

        // Game state
        this.lives = CONFIG.GAMEPLAY.STARTING_LIVES + this.upgradeManager.getExtraLives();
        this.score = 0;
        this.isPaused = false;
        this.isGameOver = false;

        // Create game objects (order matters!)
        this.createGroups();  // Must be before createBall
        this.createPaddle();
        this.createBall();

        // Input tracking - start at paddle position
        this.inputX = this.paddle.getX();
        this.createUI();
        this.setupInput();
        this.setupCollisions();

        // Start first wave
        this.startNextWave();

        // World bounds event for ball loss
        this.physics.world.on('worldbounds', this.onWorldBounds, this);
    }

    createPaddle() {
        const paddleY = CONFIG.GAME_HEIGHT - CONFIG.PADDLE.Y_OFFSET;
        this.paddle = new Paddle(this, CONFIG.GAME_WIDTH / 2, paddleY);

        // Apply paddle size upgrade
        const sizeMultiplier = this.upgradeManager.getPaddleSizeMultiplier();
        this.paddle.setBaseWidth(CONFIG.PADDLE.WIDTH * sizeMultiplier);
    }

    createBall() {
        this.balls = [];
        this.spawnBall();
    }

    spawnBall() {
        const ball = new Ball(this, this.paddle.getX(), this.paddle.getY() - 30);
        this.balls.push(ball);

        // Apply wave speed scaling and reset rally
        const currentWave = this.waveManager.getCurrentWave();
        if (currentWave > 0) {
            ball.setWave(currentWave);
        }
        ball.resetRally();

        // Add collision with paddle
        this.physics.add.collider(ball.getBody(), this.paddle.getBody(), (ballSprite, paddleSprite) => {
            ball.onPaddleHit(this.paddle);
        });

        // Add collision with all existing bricks
        this.bricks.forEach(brick => {
            this.physics.add.collider(ball.getBody(), brick.getBody(), () => {
                this.onBallHitBrick(ball, brick);
            }, () => !ball.isFireball);
        });

        return ball;
    }

    createGroups() {
        this.bricks = [];
        this.powerUps = [];
        this.coinDrops = [];
    }

    createUI() {
        const padding = 15;
        const t = (key) => localizationManager.t(key);

        // Score
        this.scoreText = this.add.text(padding, padding, `${t('score')}: 0`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_TEXT
        });

        // Wave
        this.waveText = this.add.text(CONFIG.GAME_WIDTH / 2, padding, `${t('wave')}: 1`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5, 0);

        // Lives
        this.livesText = this.add.text(CONFIG.GAME_WIDTH - padding, padding, `${t('lives')}: ${this.lives}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_TEXT
        }).setOrigin(1, 0);

        // Coins
        this.coinsText = this.add.text(padding, padding + 25, `${t('coins')}: 0`, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffd700'
        });

        // Gems (small display)
        this.gemsText = this.add.text(CONFIG.GAME_WIDTH - padding, padding + 25, `${t('gems')}: ${this.currencyManager.getGems()}`, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#e040fb'
        }).setOrigin(1, 0);

        // Power-up indicators (bottom of screen)
        this.powerUpIndicators = {};
    }

    setupInput() {
        // Detect if touch device
        this.isTouchDevice = this.sys.game.device.input.touch;
        this.touchActive = false;
        this.touchDirection = 0; // -1 left, 0 none, 1 right

        if (this.isTouchDevice) {
            // Touch controls: left half = move left, right half = move right
            this.input.on('pointerdown', (pointer) => {
                this.touchActive = true;
                this.updateTouchDirection(pointer);

                // Launch ball on tap if not launched
                this.balls.forEach(ball => {
                    if (!ball.isActive()) {
                        ball.launch();
                    }
                });
            });

            this.input.on('pointermove', (pointer) => {
                if (this.touchActive) {
                    this.updateTouchDirection(pointer);
                }
            });

            this.input.on('pointerup', () => {
                this.touchActive = false;
                this.touchDirection = 0;
            });
        } else {
            // Mouse input - paddle follows cursor
            this.input.on('pointermove', (pointer) => {
                this.inputX = pointer.x;
            });

            // Click to launch
            this.input.on('pointerdown', () => {
                this.balls.forEach(ball => {
                    if (!ball.isActive()) {
                        ball.launch();
                    }
                });
            });
        }

        // Keyboard
        this.input.keyboard.on('keydown-SPACE', () => {
            this.balls.forEach(ball => {
                if (!ball.isActive()) {
                    ball.launch();
                }
            });
        });

        this.input.keyboard.on('keydown-P', () => {
            this.togglePause();
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.togglePause();
        });
    }

    updateTouchDirection(pointer) {
        const screenMiddle = this.cameras.main.width / 2;
        if (pointer.x < screenMiddle) {
            this.touchDirection = -1; // Move left
        } else {
            this.touchDirection = 1; // Move right
        }
    }

    setupCollisions() {
        // Ball-brick collisions are set up per wave when bricks are created
    }

    startNextWave() {
        const wave = this.waveManager.nextWave();
        const t = (key) => localizationManager.t(key);
        this.waveText.setText(`${t('wave')}: ${wave}`);

        // Generate and create bricks
        const layout = this.waveManager.generateLayout();
        this.createBricks(layout);

        // Update wave speed scaling for all existing balls
        this.balls.forEach(ball => ball.setWave(wave));

        // Reset ball if needed
        if (this.balls.length === 0) {
            this.spawnBall();
        }
    }

    createBricks(layout) {
        // Clear existing bricks
        this.bricks.forEach(brick => brick.destroy());
        this.bricks = [];

        const startX = CONFIG.BRICK.OFFSET_SIDE + CONFIG.BRICK.WIDTH / 2;
        const startY = CONFIG.BRICK.OFFSET_TOP + CONFIG.BRICK.HEIGHT / 2;

        layout.forEach(brickData => {
            const x = startX + brickData.col * (CONFIG.BRICK.WIDTH + CONFIG.BRICK.PADDING);
            const y = startY + brickData.row * (CONFIG.BRICK.HEIGHT + CONFIG.BRICK.PADDING);

            const brick = new Brick(this, x, y, brickData.type);
            this.bricks.push(brick);

            // Add collision with all balls
            this.balls.forEach(ball => {
                this.physics.add.collider(ball.getBody(), brick.getBody(), () => {
                    this.onBallHitBrick(ball, brick);
                }, () => !ball.isFireball);
            });
        });
    }

    onBallHitBrick(ball, brick) {
        if (brick.isDestroyed()) return;

        // Fireball does 3x damage and passes through bricks
        const damage = ball.isFireball ? 3 : 1;
        const critChance = this.upgradeManager.getCritChance();
        const isCrit = Math.random() < critChance;
        const finalDamage = isCrit ? damage * 2 : damage;

        const destroyed = brick.hit(finalDamage);

        if (destroyed) {
            this.onBrickDestroyed(brick, isCrit);
        }

        // Screen shake on hit
        this.cameras.main.shake(50, 0.003);
    }

    onBrickDestroyed(brick, isCrit, fromExplosion = false) {
        const pos = brick.getPosition();
        const t = (key) => localizationManager.t(key);

        // Award points
        this.score += brick.points * (isCrit ? 2 : 1);
        this.scoreText.setText(`${t('score')}: ${this.score}`);

        // Drop coins
        const coinMult = this.upgradeManager.getCoinMultiplier();
        const coinValue = Math.floor(brick.coinDrop * coinMult);
        if (coinValue > 0) {
            this.spawnCoinDrop(pos.x, pos.y, coinValue);
        }

        // Check for explosive (but don't chain if already from an explosion)
        if (brick.isExplosive() && !fromExplosion) {
            this.triggerExplosion(pos.x, pos.y);
        }

        // Check for power-up drop
        if (brick.dropsPowerUp()) {
            this.spawnPowerUp(pos.x, pos.y);
        }

        // Update wave manager
        this.waveManager.brickDestroyed();
        this.saveData.totalBricksDestroyed++;

        // Particle effect
        this.createDestroyParticles(pos.x, pos.y, brick.config.color);

        // Remove from array and destroy
        const idx = this.bricks.indexOf(brick);
        if (idx > -1) {
            this.bricks.splice(idx, 1);
        }
        brick.destroy();

        // Check wave complete
        if (this.waveManager.isWaveComplete()) {
            this.onWaveComplete();
        }
    }

    triggerExplosion(x, y) {
        // Find nearby bricks and damage them
        const explosionRadius = 60;

        // Collect bricks to destroy (don't modify array while iterating)
        const bricksToDestroy = [];

        this.bricks.forEach(brick => {
            if (brick.isDestroyed()) return;
            const pos = brick.getPosition();
            const dist = Phaser.Math.Distance.Between(x, y, pos.x, pos.y);

            if (dist < explosionRadius && dist > 0) {
                const destroyed = brick.hit(1);
                if (destroyed) {
                    bricksToDestroy.push(brick);
                }
            }
        });

        // Now destroy collected bricks (with chain explosions disabled)
        bricksToDestroy.forEach(brick => {
            this.onBrickDestroyed(brick, false, true); // true = from explosion, no chain
        });

        // Visual effect
        const circle = this.add.circle(x, y, explosionRadius, 0xef5350, 0.5);
        this.tweens.add({
            targets: circle,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 200,
            onComplete: () => circle.destroy()
        });
    }

    spawnCoinDrop(x, y, value) {
        const coin = new CoinDrop(this, x, y, value);
        this.coinDrops.push(coin);

        // Collision with paddle
        this.physics.add.overlap(coin.getBody(), this.paddle.getBody(), () => {
            this.collectCoin(coin);
        });
    }

    collectCoin(coin) {
        // Prevent double collection
        if (coin.isCollected()) return;

        // Try to collect - returns false if already collected
        if (!coin.collect()) return;

        const value = coin.getValue();
        const t = (key) => localizationManager.t(key);
        this.currencyManager.addCoins(value);
        this.coinsText.setText(`${t('coins')}: ${this.currencyManager.getCoins()}`);

        // Play coin sound based on value (ascending for better coins)
        if (value >= 5) {
            this.sound.play('coin3');
        } else if (value >= 3) {
            this.sound.play('coin2');
        } else {
            this.sound.play('coin1');
        }

        const idx = this.coinDrops.indexOf(coin);
        if (idx > -1) {
            this.coinDrops.splice(idx, 1);
        }
    }

    spawnPowerUp(x, y) {
        const types = Object.keys(CONFIG.POWERUP_TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];

        const powerUp = new PowerUp(this, x, y, randomType);
        this.powerUps.push(powerUp);

        // Collision with paddle
        this.physics.add.overlap(powerUp.getBody(), this.paddle.getBody(), () => {
            this.collectPowerUp(powerUp);
        });
    }

    collectPowerUp(powerUp) {
        if (!powerUp.getBody().active) return;

        const type = powerUp.getType();
        this.activatePowerUp(type);

        this.sound.play('powerup');
        powerUp.collect();

        const idx = this.powerUps.indexOf(powerUp);
        if (idx > -1) {
            this.powerUps.splice(idx, 1);
        }
    }

    activatePowerUp(type) {
        switch (type) {
            case 'MULTIBALL':
                this.spawnExtraBall();
                break;
            case 'WIDE_PADDLE':
                this.paddle.applyWidePaddle(1.4);
                this.upgradeManager.activateTempUpgrade('WIDE_PADDLE', this);
                break;
            case 'FIREBALL':
                this.balls.forEach(ball => ball.setFireball(true));
                this.upgradeManager.activateTempUpgrade('FIREBALL', this);
                break;
            case 'SLOW':
                this.balls.forEach(ball => ball.slowDown(0.6));
                this.upgradeManager.activateTempUpgrade('SLOW', this);
                break;
            case 'SHIELD':
                this.upgradeManager.tempUpgrades.shield = true;
                break;
            case 'MAGNET':
                this.upgradeManager.activateTempUpgrade('MAGNET', this);
                break;
        }

        // Show power-up text
        this.showPowerUpText(this.getPowerUpName(type));
    }

    getPowerUpName(type) {
        const t = (key) => localizationManager.t(key);
        const names = {
            'MULTIBALL': t('multiBall'),
            'WIDE_PADDLE': t('widePaddle'),
            'FIREBALL': t('fireball'),
            'SLOW': t('slowMotion'),
            'SHIELD': t('shield'),
            'MAGNET': t('magnet')
        };
        return names[type] || type;
    }

    onPowerUpExpired(type) {
        switch (type) {
            case 'WIDE_PADDLE':
                this.paddle.resetWidth();
                break;
            case 'FIREBALL':
                this.balls.forEach(ball => ball.setFireball(false));
                break;
        }
    }

    spawnExtraBall() {
        if (this.balls.length === 0) return;

        const existingBall = this.balls.find(b => b.isActive());
        if (!existingBall) return;

        const newBall = new Ball(this, existingBall.sprite.x, existingBall.sprite.y);
        newBall.isLaunched = true;

        // Inherit wave speed from current wave
        const currentWave = this.waveManager.getCurrentWave();
        if (currentWave > 0) {
            newBall.setWave(currentWave);
        }

        // Launch in different direction using wave-scaled speed
        const angle = Phaser.Math.Between(-45, 45) * (Math.PI / 180);
        const speed = newBall.getEffectiveSpeed();
        newBall.sprite.body.setVelocity(
            Math.sin(angle) * speed,
            -Math.abs(Math.cos(angle) * speed)
        );

        this.balls.push(newBall);

        // Add collisions
        this.physics.add.collider(newBall.getBody(), this.paddle.getBody(), () => {
            newBall.onPaddleHit(this.paddle);
        });

        this.bricks.forEach(brick => {
            this.physics.add.collider(newBall.getBody(), brick.getBody(), () => {
                this.onBallHitBrick(newBall, brick);
            }, () => !newBall.isFireball);
        });
    }

    showPowerUpText(text) {
        const txt = this.add.text(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, text, {
            fontSize: '28px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: txt,
            y: txt.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy()
        });
    }

    createDestroyParticles(x, y, color) {
        // Simple particle effect using rectangles
        for (let i = 0; i < 6; i++) {
            const particle = this.add.rectangle(x, y, 6, 6, color);
            const angle = (Math.PI * 2 / 6) * i;
            const speed = Phaser.Math.Between(100, 200);

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: 300,
                onComplete: () => particle.destroy()
            });
        }
    }

    onWorldBounds(body, up, down, left, right) {
        if (down) {
            // Ball went off bottom
            const ball = this.balls.find(b => b.sprite.body === body);
            if (ball) {
                this.onBallLost(ball);
            }
        }
    }

    onBallLost(ball) {
        // Remove ball
        const idx = this.balls.indexOf(ball);
        if (idx > -1) {
            this.balls.splice(idx, 1);
            ball.destroy();
        }

        const t = (key) => localizationManager.t(key);

        // Check if any balls remain
        if (this.balls.length === 0) {
            // Check for shield
            if (this.upgradeManager.tempUpgrades.shield) {
                this.upgradeManager.tempUpgrades.shield = false;
                this.spawnBall();
                this.showPowerUpText(t('shieldUsed'));
                return;
            }

            // Lose a life
            this.lives--;
            this.livesText.setText(`${t('lives')}: ${this.lives}`);

            this.cameras.main.shake(200, 0.01);

            if (this.lives <= 0) {
                this.gameOver();
            } else {
                // Spawn new ball
                this.spawnBall();
            }
        }
    }

    onWaveComplete() {
        // Award gems
        const gemMult = this.upgradeManager.getGemMultiplier();
        const gems = Math.floor(this.waveManager.getGemsForWave() * gemMult);
        const t = (key) => localizationManager.t(key);
        this.currencyManager.addGems(gems);
        this.gemsText.setText(`${t('gems')}: ${this.currencyManager.getGems()}`);

        // Update high wave
        if (this.waveManager.getCurrentWave() > this.saveData.highestWave) {
            this.saveData.highestWave = this.waveManager.getCurrentWave();
        }

        // Save progress
        saveManager.save(this.saveData);

        // Show wave complete message
        this.showWaveComplete();

        // Go to shop
        this.time.delayedCall(1500, () => {
            this.scene.pause();
            this.scene.launch('ShopScene', {
                currencyManager: this.currencyManager,
                upgradeManager: this.upgradeManager,
                waveManager: this.waveManager,
                gameScene: this
            });
        });
    }

    showWaveComplete() {
        const t = (key) => localizationManager.t(key);
        const txt = this.add.text(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, t('waveComplete'), {
            fontSize: '32px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        this.tweens.add({
            targets: txt,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            onComplete: () => txt.destroy()
        });
    }

    continueToNextWave() {
        this.scene.resume();
        const t = (key) => localizationManager.t(key);

        // Reset ball
        this.balls.forEach(b => b.destroy());
        this.balls = [];
        this.spawnBall();

        // Clear drops
        this.powerUps.forEach(p => p.destroy());
        this.powerUps = [];
        this.coinDrops.forEach(c => c.destroy());
        this.coinDrops = [];

        // Start next wave
        this.startNextWave();

        // Update UI
        this.coinsText.setText(`${t('coins')}: ${this.currencyManager.getCoins()}`);
    }

    gameOver() {
        this.isGameOver = true;
        this.sound.play('gameover');

        // Update stats
        this.saveData.totalRuns++;
        saveManager.save(this.saveData);

        // Transition to game over scene
        this.time.delayedCall(500, () => {
            this.scene.start('GameOverScene', {
                score: this.score,
                wave: this.waveManager.getCurrentWave(),
                coins: this.currencyManager.getCoins(),
                gems: this.currencyManager.getGems()
            });
        });
    }

    togglePause() {
        // Simple pause - just freeze physics
        if (this.isPaused) {
            this.physics.resume();
            this.isPaused = false;
        } else {
            this.physics.pause();
            this.isPaused = true;
        }
    }

    update(time, delta) {
        if (this.isGameOver || this.isPaused) return;

        // Update paddle based on input type
        if (this.isTouchDevice && this.touchActive) {
            // Touch: move in direction at fixed speed
            const moveSpeed = CONFIG.PADDLE.SPEED * (delta / 1000);
            const newX = this.paddle.getX() + (this.touchDirection * moveSpeed);
            this.inputX = newX;
        }

        this.paddle.update(this.inputX);

        // Update balls
        this.balls.forEach(ball => ball.update(this.paddle));

        // Update power-ups
        this.powerUps = this.powerUps.filter(p => p.update());

        // Update coin drops
        this.coinDrops = this.coinDrops.filter(c => c.update());

        // Magnet effect
        if (this.upgradeManager.hasTempUpgrade('magnet')) {
            this.coinDrops.forEach(coin => {
                const dx = this.paddle.getX() - coin.sprite.x;
                const dy = this.paddle.getY() - coin.sprite.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    coin.sprite.body.setVelocity(dx * 3, dy * 3);
                }
            });
        }
    }
}
