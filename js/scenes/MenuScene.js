// MenuScene - Main menu with stats
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const saveData = this.game.saveData;
        const t = (key) => localizationManager.t(key);

        // Language flags (top right)
        this.createLanguageFlags(width);

        // Title
        this.add.text(width / 2, 100, t('title'), {
            fontSize: '48px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        this.add.text(width / 2, 150, t('subtitle'), {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_TEXT
        }).setOrigin(0.5);

        // Stats display
        const statsY = 250;
        this.add.text(width / 2, statsY, t('stats'), {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        const stats = [
            `${t('highestWave')}: ${saveData.highestWave}`,
            `${t('totalRuns')}: ${saveData.totalRuns}`,
            `${t('bricksDestroyed')}: ${saveData.totalBricksDestroyed}`,
            `${t('gems')}: ${saveData.gems}`,
            `${t('shards')}: ${saveData.shards}`
        ];

        stats.forEach((stat, i) => {
            this.add.text(width / 2, statsY + 35 + i * 25, stat, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: CONFIG.COLORS.UI_TEXT
            }).setOrigin(0.5);
        });

        // Play button
        const playBtn = this.createButton(width / 2, 500, t('play'), () => {
            this.scene.start('GameScene');
        });

        // Upgrades button
        const upgradeBtn = this.createButton(width / 2, 570, t('upgrades'), () => {
            this.scene.start('UpgradeScene');
        });

        // Instructions
        this.add.text(width / 2, 700, t('moveInstruction'), {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0.5);

        this.add.text(width / 2, 725, t('launchInstruction'), {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0.5);

        // Version
        this.add.text(width / 2, height - 20, t('version'), {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#666666'
        }).setOrigin(0.5);
    }

    createLanguageFlags(width) {
        const flagY = 30;
        const flagSpacing = 50;
        const startX = width - 70;
        const currentLang = localizationManager.getLanguage();

        // UK Flag
        this.createFlag(startX, flagY, 'en', currentLang === 'en');

        // Spain Flag
        this.createFlag(startX + flagSpacing, flagY, 'es', currentLang === 'es');
    }

    createFlag(x, y, lang, isActive) {
        // Use loaded flag images from CDN
        const flag = this.add.image(x, y, `flag-${lang}`)
            .setDisplaySize(40, 27)
            .setInteractive({ useHandCursor: true });

        // Border/highlight for active language
        const border = this.add.rectangle(x, y, 44, 31)
            .setStrokeStyle(isActive ? 3 : 1, isActive ? 0x4fc3f7 : 0x666666)
            .setFillStyle();

        flag.on('pointerover', () => {
            if (!isActive) border.setStrokeStyle(2, 0x888888);
        });

        flag.on('pointerout', () => {
            if (!isActive) border.setStrokeStyle(1, 0x666666);
        });

        flag.on('pointerdown', () => {
            if (localizationManager.getLanguage() !== lang) {
                localizationManager.setLanguage(lang);
                this.scene.restart();
            }
        });

        return flag;
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
