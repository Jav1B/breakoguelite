// Ball entity
class Ball {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create ball as a circle
        this.sprite = scene.add.circle(x, y, CONFIG.BALL.RADIUS, CONFIG.BALL.COLOR);
        scene.physics.add.existing(this.sprite, false);

        // Configure physics
        this.sprite.body.setCircle(CONFIG.BALL.RADIUS);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setBounce(1, 1);

        // Lose ball when hitting bottom
        this.sprite.body.onWorldBounds = true;

        // Store reference
        this.sprite.parentClass = this;

        // State
        this.isLaunched = false;
        this.isFireball = false;
        this.baseSpeed = CONFIG.BALL.BASE_SPEED;

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

            // Clamp speed
            const speed = vel.length();
            if (speed > CONFIG.BALL.MAX_SPEED) {
                vel.normalize().scale(CONFIG.BALL.MAX_SPEED);
            } else if (speed < CONFIG.BALL.MIN_SPEED && speed > 0) {
                vel.normalize().scale(CONFIG.BALL.MIN_SPEED);
            }
        }
    }

    launch() {
        if (this.isLaunched) return;

        this.isLaunched = true;

        // Launch at an angle
        const angle = Phaser.Math.Between(-60, 60) * (Math.PI / 180);
        const speed = this.baseSpeed;

        this.sprite.body.setVelocity(
            Math.sin(angle) * speed,
            -Math.cos(angle) * speed
        );
    }

    onPaddleHit(paddle) {
        // Calculate hit position relative to paddle center (-1 to 1)
        const hitPos = (this.sprite.x - paddle.getX()) / (paddle.currentWidth / 2);

        // Adjust angle based on hit position
        const maxAngle = 60 * (Math.PI / 180);
        const angle = hitPos * maxAngle;

        const speed = this.sprite.body.velocity.length();
        this.sprite.body.setVelocity(
            Math.sin(angle) * speed,
            -Math.abs(Math.cos(angle) * speed)
        );
    }

    setFireball(active) {
        this.isFireball = active;
        this.sprite.setFillStyle(active ? 0xef5350 : CONFIG.BALL.COLOR);
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
        const newSpeed = Math.min(vel.length() * factor, CONFIG.BALL.MAX_SPEED);
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
        this.sprite.setFillStyle(CONFIG.BALL.COLOR);
        this.sprite.x = paddle.getX();
        this.sprite.y = paddle.getY() - CONFIG.PADDLE.HEIGHT / 2 - CONFIG.BALL.RADIUS - 2;
        this.sprite.body.setVelocity(0, 0);
    }

    destroy() {
        this.sprite.destroy();
    }
}
