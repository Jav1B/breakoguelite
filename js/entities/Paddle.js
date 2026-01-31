// Paddle entity
class Paddle {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create paddle graphics
        const width = CONFIG.PADDLE.WIDTH;
        const height = CONFIG.PADDLE.HEIGHT;

        // Create as a rectangle with physics
        this.sprite = scene.add.rectangle(x, y, width, height, CONFIG.PADDLE.COLOR);
        scene.physics.add.existing(this.sprite, false);

        // Configure physics body
        this.sprite.body.setImmovable(true);
        this.sprite.body.setCollideWorldBounds(true);

        // Store reference to this class on sprite for collision callbacks
        this.sprite.parentClass = this;

        // Track current width for power-ups
        this.baseWidth = width;
        this.currentWidth = width;
    }

    update(inputX) {
        // Move paddle to follow input position
        const halfWidth = this.currentWidth / 2;
        const minX = halfWidth;
        const maxX = CONFIG.GAME_WIDTH - halfWidth;

        // Clamp position to game bounds
        const targetX = Phaser.Math.Clamp(inputX, minX, maxX);

        // Smooth movement
        this.sprite.x = Phaser.Math.Linear(this.sprite.x, targetX, 0.3);
    }

    setWidth(width) {
        this.currentWidth = width;
        this.sprite.setSize(width, CONFIG.PADDLE.HEIGHT);
        this.sprite.body.setSize(width, CONFIG.PADDLE.HEIGHT);
    }

    applyWidePaddle(multiplier = 1.3) {
        this.setWidth(this.baseWidth * multiplier);
    }

    resetWidth() {
        this.setWidth(this.baseWidth);
    }

    setBaseWidth(width) {
        this.baseWidth = width;
        this.currentWidth = width;
        this.setWidth(width);
    }

    getX() {
        return this.sprite.x;
    }

    getY() {
        return this.sprite.y;
    }

    getBody() {
        return this.sprite;
    }

    destroy() {
        this.sprite.destroy();
    }
}
