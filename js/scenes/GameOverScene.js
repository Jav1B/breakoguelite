// GameOverScene - Run summary and restart
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalWave = data.wave || 1;
        this.finalCoins = data.coins || 0;
        this.finalGems = data.gems || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const saveData = this.game.saveData;
        const t = (key) => localizationManager.t(key);

        // Title
        this.add.text(width / 2, 100, t('gameOver'), {
            fontSize: '42px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ef5350'
        }).setOrigin(0.5);

        // Run summary
        const summaryY = 200;
        this.add.text(width / 2, summaryY, t('runSummary'), {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        const stats = [
            { label: t('score'), value: this.finalScore.toLocaleString() },
            { label: t('waveReached'), value: this.finalWave },
            { label: t('coinsCollected'), value: this.finalCoins },
            { label: t('gemsEarned'), value: `+${this.finalGems}` }
        ];

        stats.forEach((stat, i) => {
            const y = summaryY + 50 + i * 35;

            this.add.text(width / 2 - 100, y, stat.label, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#888888'
            }).setOrigin(0, 0.5);

            this.add.text(width / 2 + 100, y, stat.value.toString(), {
                fontSize: '18px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(1, 0.5);
        });

        // Lifetime stats
        const lifetimeY = 430;
        this.add.text(width / 2, lifetimeY, t('lifetimeStats'), {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#666666'
        }).setOrigin(0.5);

        const lifetimeStats = [
            { label: t('totalRuns'), value: saveData.totalRuns },
            { label: t('highestWave'), value: saveData.highestWave },
            { label: t('totalGems'), value: saveData.gems },
            { label: t('bricksDestroyed'), value: saveData.totalBricksDestroyed.toLocaleString() }
        ];

        lifetimeStats.forEach((stat, i) => {
            const y = lifetimeY + 35 + i * 28;

            this.add.text(width / 2 - 80, y, stat.label, {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#555555'
            }).setOrigin(0, 0.5);

            this.add.text(width / 2 + 80, y, stat.value.toString(), {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#777777'
            }).setOrigin(1, 0.5);
        });

        // Buttons
        this.createButton(width / 2, 620, t('playAgain'), () => {
            this.scene.start('GameScene');
        });

        this.createButton(width / 2, 690, t('upgrades'), () => {
            this.scene.start('UpgradeScene');
        });

        this.createButton(width / 2, 760, t('mainMenu'), () => {
            this.scene.start('MenuScene');
        });
    }

    createButton(x, y, text, callback) {
        const btn = this.add.rectangle(x, y, 200, 45, 0x333333)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setFillStyle(0x444444))
            .on('pointerout', () => btn.setFillStyle(0x333333))
            .on('pointerdown', callback);

        btn.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(CONFIG.COLORS.UI_ACCENT).color);

        this.add.text(x, y, text, {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_TEXT
        }).setOrigin(0.5);

        return btn;
    }
}
