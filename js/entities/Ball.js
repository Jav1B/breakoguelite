// Ball entity
class Ball {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create ball as a sprite
        this.sprite = scene.add.sprite(x, y, 'ball-normal');
        this.sprite.setDisplaySize(CONFIG.BALL.RADIUS * 2, CONFIG.BALL.RADIUS * 2);
        scene.physics.add.existing(this.sprite, false);

        // Configure physics
        this.sprite.body.setCircle(CONFIG.BALL.RADIUS,
            (this.sprite.displayWidth / 2) - CONFIG.BALL.RADIUS,
            (this.sprite.displayHeight / 2) - CONFIG.BALL.RADIUS);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setBounce(1, 1);

        // Lose ball when hitting bottom
        this.sprite.body.onWorldBounds = true;

        // Store reference
        this.sprite.parentClass = this;

        // State
        this.isLaunched = false;
        this.isFireball = false;

        // Apply ball speed reduction from upgrades (makes ball easier to control)
        const speedReduction = scene.upgradeManager ? scene.upgradeManager.getBallSpeedReduction() : 0;
        this.speedMultiplier = 1 - speedReduction;
        this.baseSpeed = CONFIG.BALL.BASE_SPEED * this.speedMultiplier;
        this.maxSpeed = CONFIG.BALL.MAX_SPEED * this.speedMultiplier;

        // Wave and rally scaling
        this.waveSpeedMultiplier = 1.0;  // 8% increase per wave
        this.rallyHits = 0;              // Paddle hits since last ball loss
        this.rallyAcceleration = 0.02;   // 2% speed increase per paddle hit

        // Trail effect (simple)
        this.trail = [];
    }

    update(paddle) {
        if (!this.isLaunched) {
            // Stick to paddle
            this.sprite.x = paddle.getX();
            this.sprite.y = paddle.getY() - CONFIG.PADDLE.HEIGHT / 2 - CONFIG.BALL.RADIUS - 2;
            this.sprite.body.setVelocity(0, 0);
        } else {
            // Ensure minimum horizontal velocity to prevent vertical loops
            const vel = this.sprite.body.velocity;
            const minHorizontal = 50;

            if (Math.abs(vel.x) < minHorizontal && vel.y !== 0) {
                const sign = vel.x >= 0 ? 1 : -1;
                this.sprite.body.setVelocityX(sign * minHorizontal);
            }

            // Clamp speed (using upgraded max speed)
            const speed = vel.length();
            if (speed > this.maxSpeed) {
                vel.normalize().scale(this.maxSpeed);
            } else if (speed < CONFIG.BALL.MIN_SPEED && speed > 0) {
                vel.normalize().scale(CONFIG.BALL.MIN_SPEED);
            }
        }
    }

    launch() {
        if (this.isLaunched) return;

        this.isLaunched = true;

        // Launch at an angle with wave-scaled speed
        const angle = Phaser.Math.Between(-60, 60) * (Math.PI / 180);
        const speed = this.getEffectiveSpeed();

        this.sprite.body.setVelocity(
            Math.sin(angle) * speed,
            -Math.cos(angle) * speed
        );
    }

    // Calculate effective speed based on wave and rally
    getEffectiveSpeed() {
        const waveSpeed = this.baseSpeed * this.waveSpeedMultiplier;
        const rallyBonus = 1 + (this.rallyHits * this.rallyAcceleration);
        return Math.min(waveSpeed * rallyBonus, this.maxSpeed);
    }

    // Set wave multiplier (called at wave start)
    setWave(wave) {
        // 8% increase per wave: wave 1 = 1.0, wave 2 = 1.08, wave 5 = 1.36, wave 10 = 2.0
        this.waveSpeedMultiplier = Math.pow(1.08, wave - 1);
    }

    // Reset rally counter (called when spawning new ball after loss)
    resetRally() {
        this.rallyHits = 0;
    }

    onPaddleHit(paddle) {
        // Increment rally counter for acceleration
        this.rallyHits++;

        // Calculate hit position relative to paddle center (-1 to 1)
        const hitPos = (this.sprite.x - paddle.getX()) / (paddle.currentWidth / 2);

        // Adjust angle based on hit position
        const maxAngle = 60 * (Math.PI / 180);
        const angle = hitPos * maxAngle;

        // Apply rally acceleration (2% faster per hit, capped at upgraded max speed)
        const currentSpeed = this.sprite.body.velocity.length();
        const newSpeed = Math.min(currentSpeed * (1 + this.rallyAcceleration), this.maxSpeed);

        this.sprite.body.setVelocity(
            Math.sin(angle) * newSpeed,
            -Math.abs(Math.cos(angle) * newSpeed)
        );
    }

    setFireball(active) {
        this.isFireball = active;
        this.sprite.setTexture(active ? 'ball-fireball' : 'ball-normal');
    }

    setSpeed(speed) {
        if (!this.isLaunched) return;

        const vel = this.sprite.body.velocity;
        const currentSpeed = vel.length();
        if (currentSpeed > 0) {
            vel.normalize().scale(speed);
        }
    }

    slowDown(factor = 0.7) {
        const vel = this.sprite.body.velocity;
        const newSpeed = Math.max(vel.length() * factor, CONFIG.BALL.MIN_SPEED);
        vel.normalize().scale(newSpeed);
    }

    speedUp(factor = 1.1) {
        const vel = this.sprite.body.velocity;
        const newSpeed = Math.min(vel.length() * factor, this.maxSpeed);
        vel.normalize().scale(newSpeed);
    }

    getBody() {
        return this.sprite;
    }

    isActive() {
        return this.isLaunched;
    }

    reset(paddle) {
        this.isLaunched = false;
        this.isFireball = false;
        this.sprite.setTexture('ball-normal');
        this.sprite.x = paddle.getX();
        this.sprite.y = paddle.getY() - CONFIG.PADDLE.HEIGHT / 2 - CONFIG.BALL.RADIUS - 2;
        this.sprite.body.setVelocity(0, 0);
    }

    destroy() {
        this.sprite.destroy();
    }
}
