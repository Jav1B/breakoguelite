// Brick entity
class Brick {
    constructor(scene, x, y, type = 'NORMAL') {
        this.scene = scene;
        this.type = type;
        this.config = CONFIG.BRICK_TYPES[type] || CONFIG.BRICK_TYPES.NORMAL;

        this.hp = this.config.hp;
        this.maxHp = this.config.hp;
        this.points = this.config.points;
        this.coinDrop = this.config.coinDrop;

        // Check if sprite texture exists
        const spriteKey = this.config.sprite;
        const hasSprite = spriteKey && scene.textures.exists(spriteKey);

        if (hasSprite) {
            // Create brick sprite
            this.sprite = scene.add.image(x, y, spriteKey);
            this.sprite.setDisplaySize(CONFIG.BRICK.WIDTH, CONFIG.BRICK.HEIGHT);
        } else {
            // Fallback to rectangle if sprite not loaded
            this.sprite = scene.add.rectangle(
                x, y,
                CONFIG.BRICK.WIDTH,
                CONFIG.BRICK.HEIGHT,
                this.config.color
            );
            this.sprite.setStrokeStyle(2, 0x000000, 0.3);
        }

        scene.physics.add.existing(this.sprite, true); // true = static body

        // Store reference
        this.sprite.parentClass = this;

        // HP indicator for multi-hit bricks
        if (this.maxHp > 1 && this.maxHp !== Infinity) {
            this.hpText = scene.add.text(x, y, this.hp.toString(), {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        }
    }

    hit(damage = 1) {
        if (this.hp === Infinity) {
            // Indestructible - visual feedback only
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 50,
                yoyo: true
            });
            return false; // Not destroyed
        }

        this.hp -= damage;

        // Update HP text
        if (this.hpText) {
            this.hpText.setText(Math.max(0, this.hp).toString());
        }

        // Visual feedback
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });

        // Darken sprite based on remaining HP (for multi-hit bricks)
        if (this.hp > 0 && this.maxHp > 1) {
            const hpRatio = this.hp / this.maxHp;
            // Apply tint to show damage
            const tintValue = Math.floor(255 * (0.5 + 0.5 * hpRatio));
            this.sprite.setTint(Phaser.Display.Color.GetColor(tintValue, tintValue, tintValue));
        }

        return this.hp <= 0;
    }

    isDestroyed() {
        return this.hp <= 0;
    }

    isExplosive() {
        return this.config.explosive === true;
    }

    dropsPowerUp() {
        return this.config.dropsPowerUp === true;
    }

    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    getBody() {
        return this.sprite;
    }

    destroy() {
        if (this.hpText) {
            this.hpText.destroy();
        }
        this.sprite.destroy();
    }
}
