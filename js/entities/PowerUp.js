// PowerUp entity - collectible drops
class PowerUp {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;
        this.config = CONFIG.POWERUP_TYPES[type];

        // Create power-up as a small rectangle/diamond
        this.sprite = scene.add.rectangle(
            x, y,
            24, 24,
            this.config.color
        );

        scene.physics.add.existing(this.sprite, false);

        // Set up physics
        this.sprite.body.setVelocityY(150); // Fall down
        this.sprite.body.setAllowGravity(false);

        // Store reference
        this.sprite.parentClass = this;

        // Rotate for visual effect
        this.sprite.setAngle(45);

        // Add glow effect
        this.sprite.setStrokeStyle(2, 0xffffff, 0.5);

        // Pulsing animation
        scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    update() {
        // Remove if off screen
        if (this.sprite.y > CONFIG.GAME_HEIGHT + 50) {
            this.destroy();
            return false;
        }
        return true;
    }

    collect() {
        // Collection animation
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                this.destroy();
            }
        });
    }

    getType() {
        return this.type;
    }

    getBody() {
        return this.sprite;
    }

    destroy() {
        if (this.sprite && this.sprite.active) {
            this.sprite.destroy();
        }
    }
}

// Coin drop entity
class CoinDrop {
    constructor(scene, x, y, value = 1) {
        this.scene = scene;
        this.value = value;
        this.collected = false;

        // Create coin as a small circle
        this.sprite = scene.add.circle(x, y, 8, CONFIG.COLORS.COIN);
        scene.physics.add.existing(this.sprite, false);

        this.sprite.body.setCircle(8);

        // Initial burst upward and sideways
        this.sprite.body.setVelocity(
            Phaser.Math.Between(-80, 80),
            Phaser.Math.Between(-150, -80)
        );

        // Use gravity to make coins fall naturally
        this.sprite.body.setAllowGravity(true);
        this.sprite.body.setGravityY(300);

        this.sprite.parentClass = this;

        // Sparkle effect
        this.sprite.setStrokeStyle(2, 0xffffff, 0.7);
    }

    update() {
        if (!this.sprite || !this.sprite.active) return false;
        if (this.sprite.y > CONFIG.GAME_HEIGHT + 20) {
            this.destroy();
            return false;
        }
        return true;
    }

    collect() {
        if (this.collected) return false;
        this.collected = true;

        // Disable physics immediately
        if (this.sprite.body) {
            this.sprite.body.enable = false;
        }

        // Animate and destroy
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 150,
            onComplete: () => {
                this.destroy();
            }
        });

        return true;
    }

    isCollected() {
        return this.collected;
    }

    getValue() {
        return this.value;
    }

    getBody() {
        return this.sprite;
    }

    destroy() {
        if (this.sprite && this.sprite.active) {
            this.sprite.destroy();
        }
    }
}
