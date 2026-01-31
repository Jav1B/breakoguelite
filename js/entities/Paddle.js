// Paddle entity
class Paddle {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create paddle graphics
        const width = CONFIG.PADDLE.WIDTH;
        const height = CONFIG.PADDLE.HEIGHT;

        // Create as a sprite with physics
        this.sprite = scene.add.sprite(x, y, 'paddle-standard');
        this.sprite.setDisplaySize(width, height);
        scene.physics.add.existing(this.sprite, false);

        // Configure physics body
        this.sprite.body.setImmovable(true);
        this.sprite.body.setCollideWorldBounds(true);

        // Store reference to this class on sprite for collision callbacks
        this.sprite.parentClass = this;

        // Track current width for power-ups
        this.baseWidth = width;
        this.currentWidth = width;
        this.isWide = false;
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

    setWidth(width, isWide = false) {
        this.currentWidth = width;
        this.isWide = isWide;
        this.sprite.setTexture(isWide ? 'paddle-wide' : 'paddle-standard');
        this.sprite.setDisplaySize(width, CONFIG.PADDLE.HEIGHT);
        this.sprite.body.setSize(width, CONFIG.PADDLE.HEIGHT);
    }

    applyWidePaddle(multiplier = 1.3) {
        this.setWidth(this.baseWidth * multiplier, true);
    }

    resetWidth() {
        this.setWidth(this.baseWidth, false);
    }

    setBaseWidth(width) {
        this.baseWidth = width;
        this.currentWidth = width;
        this.setWidth(width, this.isWide);
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
