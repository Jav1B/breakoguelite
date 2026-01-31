// UpgradeScene - Permanent upgrades between runs
class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.saveData = this.game.saveData;
        const t = (key) => localizationManager.t(key);

        // Title
        this.add.text(width / 2, 50, t('upgrades'), {
            fontSize: '36px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        // Gems display
        this.gemsText = this.add.text(width / 2, 90, `${t('gems')}: ${this.saveData.gems}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#e040fb'
        }).setOrigin(0.5);

        // Upgrades list
        const upgrades = [
            { key: 'startingCoins', name: t('startingCoins'), desc: t('startingCoinsDesc'), costKey: 'STARTING_COINS' },
            { key: 'paddleSize', name: t('paddleSize'), desc: t('paddleSizeDesc'), costKey: 'PADDLE_SIZE' },
            { key: 'ballSpeed', name: t('ballControl'), desc: t('ballControlDesc'), costKey: 'BALL_SPEED' },
            { key: 'coinMult', name: t('coinBonus'), desc: t('coinBonusDesc'), costKey: 'COIN_MULT' },
            { key: 'extraLives', name: t('extraLives'), desc: t('extraLivesDesc'), costKey: 'EXTRA_LIVES' },
            { key: 'critChance', name: t('criticalHit'), desc: t('criticalHitDesc'), costKey: 'CRIT_CHANCE' },
            { key: 'shopDiscount', name: t('shopDiscount'), desc: t('shopDiscountDesc'), costKey: 'SHOP_DISCOUNT' }
        ];

        const startY = 150;
        const itemHeight = 75;

        this.upgradeItems = [];

        upgrades.forEach((upgrade, i) => {
            const y = startY + i * itemHeight;
            const item = this.createUpgradeItem(width / 2, y, upgrade);
            this.upgradeItems.push(item);
        });

        // Back button
        this.createButton(width / 2, height - 60, t('back'), () => {
            this.scene.start('MenuScene');
        });
    }

    createUpgradeItem(x, y, upgrade) {
        const currentLevel = this.saveData.upgrades[upgrade.key] || 0;
        const costs = CONFIG.UPGRADE_COSTS[upgrade.costKey];
        const maxLevel = costs.length;
        const isMaxed = currentLevel >= maxLevel;
        const nextCost = isMaxed ? null : costs[currentLevel];
        const canAfford = !isMaxed && this.saveData.gems >= nextCost;
        const t = (key) => localizationManager.t(key);

        // Background
        const bg = this.add.rectangle(x, y, 340, 60, canAfford ? 0x333333 : 0x222222);

        if (canAfford) {
            bg.setInteractive({ useHandCursor: true })
                .on('pointerover', () => bg.setFillStyle(0x444444))
                .on('pointerout', () => bg.setFillStyle(0x333333))
                .on('pointerdown', () => this.purchaseUpgrade(upgrade.key, nextCost));
        }

        // Name
        this.add.text(x - 150, y - 15, upgrade.name, {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        // Description
        this.add.text(x - 150, y + 8, upgrade.desc, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0, 0.5);

        // Level indicator
        let levelText = `${t('level')} ${currentLevel}/${maxLevel}`;
        this.add.text(x + 60, y - 8, levelText, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: isMaxed ? '#4fc3f7' : '#ffffff'
        }).setOrigin(0.5);

        // Cost or MAX
        const costText = isMaxed ? t('max') : nextCost.toString();
        const costColor = isMaxed ? '#4fc3f7' : (canAfford ? '#e040fb' : '#666666');
        this.add.text(x + 130, y + 8, costText, {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: costColor
        }).setOrigin(0.5);

        // Level pips
        const pipStartX = x - 150;
        const pipY = y + 24;
        for (let i = 0; i < maxLevel; i++) {
            const filled = i < currentLevel;
            this.add.rectangle(
                pipStartX + i * 12, pipY,
                8, 4,
                filled ? 0x4fc3f7 : 0x444444
            );
        }

        return { bg, upgrade, currentLevel };
    }

    purchaseUpgrade(key, cost) {
        if (this.saveData.gems >= cost) {
            this.saveData.gems -= cost;
            this.saveData.upgrades[key]++;
            saveManager.save(this.saveData);

            // Refresh scene
            this.scene.restart();
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
