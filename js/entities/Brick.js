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

        // Create brick rectangle
        this.sprite = scene.add.rectangle(
            x, y,
            CONFIG.BRICK.WIDTH,
            CONFIG.BRICK.HEIGHT,
            this.config.color
        );

        scene.physics.add.existing(this.sprite, true); // true = static body

        // Store reference
        this.sprite.parentClass = this;

        // Add border for visibility
        this.sprite.setStrokeStyle(2, 0x000000, 0.3);

        // HP indicator for multi-hit bricks
        if (this.maxHp > 1 && this.maxHp !== Infinity) {
            this.hpText = scene.add.text(x, y, this.hp.toString(), {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ffffff'
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

        // Update color based on remaining HP
        if (this.hp > 0 && this.maxHp > 1) {
            const hpRatio = this.hp / this.maxHp;
            const darkenAmount = 1 - (0.3 * (1 - hpRatio));
            const color = Phaser.Display.Color.ValueToColor(this.config.color);
            color.darken(30 * (1 - hpRatio));
            this.sprite.setFillStyle(color.color);
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
