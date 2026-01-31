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

        // Size and color based on value
        const coinConfig = this.getCoinConfig(value);

        // Create coin as a circle with value-based size
        this.sprite = scene.add.circle(x, y, coinConfig.radius, coinConfig.color);
        scene.physics.add.existing(this.sprite, false);

        this.sprite.body.setCircle(coinConfig.radius);
        this.radius = coinConfig.radius;

        // Initial burst upward and sideways
        this.sprite.body.setVelocity(
            Phaser.Math.Between(-80, 80),
            Phaser.Math.Between(-150, -80)
        );

        // Use gravity to make coins fall naturally
        this.sprite.body.setAllowGravity(true);
        this.sprite.body.setGravityY(300);

        this.sprite.parentClass = this;

        // Sparkle effect with value-based stroke
        this.sprite.setStrokeStyle(coinConfig.stroke, 0xffffff, 0.8);

        // Add value text for coins worth 2+
        if (value >= 2) {
            this.valueText = scene.add.text(x, y, value.toString(), {
                fontSize: coinConfig.fontSize,
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#000000'
            }).setOrigin(0.5);
        }

        // Pulsing effect for high-value coins
        if (value >= 3) {
            scene.tweens.add({
                targets: this.sprite,
                scaleX: 1.15,
                scaleY: 1.15,
                duration: 200,
                yoyo: true,
                repeat: -1
            });
        }
    }

    getCoinConfig(value) {
        if (value >= 5) {
            // Large gold coin with sparkle
            return { radius: 14, color: 0xffd700, stroke: 3, fontSize: '14px' };
        } else if (value >= 3) {
            // Medium silver-gold coin
            return { radius: 12, color: 0xffec8b, stroke: 2, fontSize: '12px' };
        } else if (value >= 2) {
            // Small bronze coin
            return { radius: 10, color: 0xdaa520, stroke: 2, fontSize: '10px' };
        } else {
            // Basic copper coin
            return { radius: 8, color: 0xcd853f, stroke: 1, fontSize: '8px' };
        }
    }

    update() {
        if (!this.sprite || !this.sprite.active) return false;

        // Bounce off side walls manually (so coins can still fall off bottom)
        const x = this.sprite.x;
        const vel = this.sprite.body.velocity;
        if (x - this.radius < 0) {
            this.sprite.x = this.radius;
            vel.x = Math.abs(vel.x) * 0.7;
        } else if (x + this.radius > CONFIG.GAME_WIDTH) {
            this.sprite.x = CONFIG.GAME_WIDTH - this.radius;
            vel.x = -Math.abs(vel.x) * 0.7;
        }

        // Update value text position to follow coin
        if (this.valueText) {
            this.valueText.x = this.sprite.x;
            this.valueText.y = this.sprite.y;
        }

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

        // Animate coin and text together
        const targets = [this.sprite];
        if (this.valueText) {
            targets.push(this.valueText);
        }

        this.scene.tweens.add({
            targets: targets,
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
        if (this.valueText) {
            this.valueText.destroy();
            this.valueText = null;
        }
        if (this.sprite && this.sprite.active) {
            this.sprite.destroy();
        }
    }
}
