// MenuScene - Main menu with stats
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.titleClickCount = 0;
        this.lastClickTime = 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const saveData = this.game.saveData;
        const t = (key) => localizationManager.t(key);

        // Add background
        if (this.textures.exists('bg-menu')) {
            this.add.image(width / 2, height / 2, 'bg-menu')
                .setDisplaySize(width, height)
                .setAlpha(0.7);
        }

        // Language flags (top right)
        this.createLanguageFlags(width);

        // Title (clickable for secret cheat - 5 clicks = max gems)
        const title = this.add.text(width / 2, 100, t('title'), {
            fontSize: '48px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5).setInteractive({ useHandCursor: false });

        title.on('pointerdown', () => {
            const now = Date.now();
            // Reset count if more than 1 second between clicks
            if (now - this.lastClickTime > 1000) {
                this.titleClickCount = 0;
            }
            this.lastClickTime = now;
            this.titleClickCount++;

            if (this.titleClickCount >= 5) {
                this.titleClickCount = 0;
                // Add max gems (enough to buy all upgrades and then some)
                saveData.gems = 9999;
                saveData.shards = 999;
                saveManager.save(saveData);

                // Flash effect
                this.cameras.main.flash(200, 255, 215, 0);

                // Show cheat message
                const cheatText = this.add.text(width / 2, height / 2, t('cheatsEnabled'), {
                    fontSize: '32px',
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    color: '#ffd700'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: cheatText,
                    alpha: 0,
                    y: height / 2 - 50,
                    duration: 1500,
                    onComplete: () => {
                        cheatText.destroy();
                        this.scene.restart();
                    }
                });
            }
        });

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

        // Reset button (bottom left)
        this.createResetButton(80, height - 30, t);
    }

    createResetButton(x, y, t) {
        const resetBtn = this.add.text(x, y, t('resetProgress'), {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#666666'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        resetBtn.on('pointerover', () => resetBtn.setColor('#ff6666'));
        resetBtn.on('pointerout', () => resetBtn.setColor('#666666'));

        resetBtn.on('pointerdown', () => {
            // Show confirmation dialog
            if (this.confirmDialog) return;

            const width = this.cameras.main.width;
            const height = this.cameras.main.height;

            // Dim background
            const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

            // Dialog box
            const dialog = this.add.rectangle(width / 2, height / 2, 280, 120, 0x333333)
                .setStrokeStyle(2, 0xff6666);

            // Confirm text
            const confirmText = this.add.text(width / 2, height / 2 - 25, t('resetConfirm'), {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }).setOrigin(0.5);

            // Yes button
            const yesBtn = this.add.text(width / 2 - 50, height / 2 + 25, 'YES', {
                fontSize: '16px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#ff6666'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            yesBtn.on('pointerover', () => yesBtn.setColor('#ff9999'));
            yesBtn.on('pointerout', () => yesBtn.setColor('#ff6666'));
            yesBtn.on('pointerdown', () => {
                saveManager.reset();
                this.game.saveData = saveManager.load();
                this.scene.restart();
            });

            // No button
            const noBtn = this.add.text(width / 2 + 50, height / 2 + 25, 'NO', {
                fontSize: '16px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#66ff66'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            noBtn.on('pointerover', () => noBtn.setColor('#99ff99'));
            noBtn.on('pointerout', () => noBtn.setColor('#66ff66'));
            noBtn.on('pointerdown', () => {
                overlay.destroy();
                dialog.destroy();
                confirmText.destroy();
                yesBtn.destroy();
                noBtn.destroy();
                this.confirmDialog = false;
            });

            this.confirmDialog = true;
        });
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
