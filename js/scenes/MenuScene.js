// MenuScene - Main menu with stats
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const saveData = this.game.saveData;

        // Title
        this.add.text(width / 2, 100, 'BREAKOUT', {
            fontSize: '48px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        this.add.text(width / 2, 150, 'ROGUELIKE', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_TEXT
        }).setOrigin(0.5);

        // Stats display
        const statsY = 250;
        this.add.text(width / 2, statsY, 'STATS', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        const stats = [
            `Highest Wave: ${saveData.highestWave}`,
            `Total Runs: ${saveData.totalRuns}`,
            `Bricks Destroyed: ${saveData.totalBricksDestroyed}`,
            `Gems: ${saveData.gems}`,
            `Shards: ${saveData.shards}`
        ];

        stats.forEach((stat, i) => {
            this.add.text(width / 2, statsY + 35 + i * 25, stat, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: CONFIG.COLORS.UI_TEXT
            }).setOrigin(0.5);
        });

        // Play button
        const playBtn = this.createButton(width / 2, 500, 'PLAY', () => {
            this.scene.start('GameScene');
        });

        // Upgrades button
        const upgradeBtn = this.createButton(width / 2, 570, 'UPGRADES', () => {
            this.scene.start('UpgradeScene');
        });

        // Instructions
        this.add.text(width / 2, 700, 'Move: Mouse / Touch', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0.5);

        this.add.text(width / 2, 725, 'Launch: Click / Tap', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0.5);

        // Version
        this.add.text(width / 2, height - 20, 'v0.1 MVP', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#666666'
        }).setOrigin(0.5);
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
