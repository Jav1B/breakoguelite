// ShopScene - Between-wave shop for temporary upgrades
class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
    }

    init(data) {
        this.currencyManager = data.currencyManager;
        this.upgradeManager = data.upgradeManager;
        this.waveManager = data.waveManager;
        this.gameScene = data.gameScene;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const t = (key) => localizationManager.t(key);

        // Semi-transparent background
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        // Title
        this.add.text(width / 2, 80, t('shop'), {
            fontSize: '36px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        // Wave info
        this.add.text(width / 2, 120, `${t('preparingForWave')} ${this.waveManager.getCurrentWave() + 1}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0.5);

        // Coins display
        this.coinsText = this.add.text(width / 2, 160, `${t('coins')}: ${this.currencyManager.getCoins()}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Shop items
        const items = [
            { key: 'MULTIBALL', name: t('multiBall'), desc: t('multiBallDesc'), price: CONFIG.SHOP_PRICES.MULTIBALL },
            { key: 'WIDE_PADDLE', name: t('widePaddle'), desc: t('widePaddleDesc'), price: CONFIG.SHOP_PRICES.WIDE_PADDLE },
            { key: 'FIREBALL', name: t('fireball'), desc: t('fireballDesc'), price: CONFIG.SHOP_PRICES.FIREBALL },
            { key: 'SLOW', name: t('slowMotion'), desc: t('slowMotionDesc'), price: CONFIG.SHOP_PRICES.SLOW },
            { key: 'SHIELD', name: t('shield'), desc: t('shieldDesc'), price: CONFIG.SHOP_PRICES.SHIELD },
            { key: 'MAGNET', name: t('magnet'), desc: t('magnetDesc'), price: CONFIG.SHOP_PRICES.MAGNET }
        ];

        // Apply shop discount
        const discount = this.upgradeManager.getShopDiscount();

        const startY = 220;
        const itemHeight = 70;

        items.forEach((item, i) => {
            const y = startY + i * itemHeight;
            const finalPrice = Math.floor(item.price * (1 - discount));

            this.createShopItem(width / 2, y, item, finalPrice);
        });

        // Continue button
        this.createButton(width / 2, height - 80, t('continue'), () => {
            this.scene.stop();
            this.gameScene.continueToNextWave();
        });
    }

    createShopItem(x, y, item, price) {
        const config = CONFIG.POWERUP_TYPES[item.key];
        const canAfford = this.currencyManager.getCoins() >= price;

        // Background
        const bg = this.add.rectangle(x, y, 280, 55, canAfford ? 0x333333 : 0x222222)
            .setInteractive({ useHandCursor: canAfford });

        if (canAfford) {
            bg.on('pointerover', () => bg.setFillStyle(0x444444));
            bg.on('pointerout', () => bg.setFillStyle(0x333333));
            bg.on('pointerdown', () => this.purchaseItem(item.key, price, bg));
        }

        // Color indicator
        this.add.rectangle(x - 120, y, 8, 40, config.color);

        // Name
        this.add.text(x - 100, y - 10, item.name, {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: canAfford ? '#ffffff' : '#666666'
        }).setOrigin(0, 0.5);

        // Description
        this.add.text(x - 100, y + 10, item.desc, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0, 0.5);

        // Price
        this.add.text(x + 100, y, `${price}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: canAfford ? '#ffd700' : '#666666'
        }).setOrigin(0.5);
    }

    purchaseItem(key, price, button) {
        if (this.currencyManager.spendCoins(price)) {
            // Apply power-up to game scene
            this.gameScene.activatePowerUp(key);

            // Update display
            const t = (key) => localizationManager.t(key);
            this.coinsText.setText(`${t('coins')}: ${this.currencyManager.getCoins()}`);

            // Visual feedback
            button.setFillStyle(0x4fc3f7);
            this.time.delayedCall(200, () => {
                button.setFillStyle(0x333333);
            });

            // Rebuild shop to update afford states
            this.scene.restart({
                currencyManager: this.currencyManager,
                upgradeManager: this.upgradeManager,
                waveManager: this.waveManager,
                gameScene: this.gameScene
            });
        }
    }

    createButton(x, y, text, callback) {
        const btn = this.add.rectangle(x, y, 200, 50, 0x333333)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setFillStyle(0x444444))
            .on('pointerout', () => btn.setFillStyle(0x333333))
            .on('pointerdown', callback);

        btn.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(CONFIG.COLORS.UI_ACCENT).color);

        this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_TEXT
        }).setOrigin(0.5);

        return btn;
    }
}
