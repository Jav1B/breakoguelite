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

        // Title logo (clickable for secret cheat - 5 clicks = max gems)
        let title;
        if (this.textures.exists('title-logo')) {
            title = this.add.image(width / 2, 120, 'title-logo')
                .setDisplaySize(400, 200)
                .setInteractive({ useHandCursor: false });
        } else {
            title = this.add.text(width / 2, 100, t('title'), {
                fontSize: '48px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: CONFIG.COLORS.UI_ACCENT
            }).setOrigin(0.5).setInteractive({ useHandCursor: false });
        }

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

        // Currency display (compact, below title)
        const currencyY = 240;
        this.add.text(width / 2 - 60, currencyY, `${saveData.gems}`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#e040fb'
        }).setOrigin(1, 0.5);
        this.add.text(width / 2 - 55, currencyY, t('gems'), {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0, 0.5);

        this.add.text(width / 2 + 60, currencyY, `${saveData.shards}`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#00e5ff'
        }).setOrigin(1, 0.5);
        this.add.text(width / 2 + 65, currencyY, t('shards'), {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0, 0.5);

        // Play button
        const playBtn = this.createButton(width / 2, 340, t('play'), () => {
            this.scene.start('GameScene');
        });

        // Check if any upgrades are affordable
        const canAffordUpgrade = this.checkAffordableUpgrades(saveData);

        // Upgrades button (highlighted if upgrades available)
        const upgradeBtn = this.createButton(width / 2, 410, t('upgrades'), () => {
            this.scene.start('UpgradeScene');
        }, canAffordUpgrade);

        // Stats button
        const statsBtn = this.createButton(width / 2, 480, t('stats'), () => {
            this.showStatsDialog(saveData, t);
        });

        // Instructions
        this.add.text(width / 2, 560, t('moveInstruction'), {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0.5);

        this.add.text(width / 2, 585, t('launchInstruction'), {
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
        const startX = width - 90;
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

    createButton(x, y, text, callback, highlight = false) {
        const baseColor = highlight ? 0x4a3366 : 0x333333;
        const hoverColor = highlight ? 0x5a4376 : 0x444444;
        const strokeColor = highlight ? 0xe040fb : Phaser.Display.Color.HexStringToColor(CONFIG.COLORS.UI_ACCENT).color;

        const btn = this.add.rectangle(x, y, 200, 50, baseColor)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setFillStyle(hoverColor))
            .on('pointerout', () => btn.setFillStyle(baseColor))
            .on('pointerdown', callback);

        btn.setStrokeStyle(highlight ? 3 : 2, strokeColor);

        this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: highlight ? '#e040fb' : CONFIG.COLORS.UI_TEXT
        }).setOrigin(0.5);

        // Add pulsing glow effect for highlighted buttons
        if (highlight) {
            this.tweens.add({
                targets: btn,
                alpha: 0.8,
                duration: 600,
                yoyo: true,
                repeat: -1
            });
        }

        return btn;
    }

    checkAffordableUpgrades(saveData) {
        const upgradeKeys = ['STARTING_COINS', 'PADDLE_SIZE', 'BALL_SPEED', 'COIN_MULT', 'EXTRA_LIVES', 'CRIT_CHANCE', 'SHOP_DISCOUNT'];
        const keyMap = {
            'STARTING_COINS': 'startingCoins',
            'PADDLE_SIZE': 'paddleSize',
            'BALL_SPEED': 'ballSpeed',
            'COIN_MULT': 'coinMult',
            'EXTRA_LIVES': 'extraLives',
            'CRIT_CHANCE': 'critChance',
            'SHOP_DISCOUNT': 'shopDiscount'
        };

        for (const costKey of upgradeKeys) {
            const upgradeKey = keyMap[costKey];
            const currentLevel = saveData.upgrades[upgradeKey] || 0;
            const costs = CONFIG.UPGRADE_COSTS[costKey];
            if (currentLevel < costs.length && saveData.gems >= costs[currentLevel]) {
                return true;
            }
        }
        return false;
    }

    showStatsDialog(saveData, t) {
        if (this.statsDialog) return;

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Dim background
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
            .setInteractive();

        // Dialog box
        const dialog = this.add.rectangle(width / 2, height / 2, 300, 280, 0x222222)
            .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(CONFIG.COLORS.UI_ACCENT).color);

        // Title
        const titleText = this.add.text(width / 2, height / 2 - 110, t('stats'), {
            fontSize: '24px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5);

        // Stats
        const stats = [
            `${t('highestWave')}: ${saveData.highestWave}`,
            `${t('totalRuns')}: ${saveData.totalRuns}`,
            `${t('bricksDestroyed')}: ${saveData.totalBricksDestroyed}`,
            `${t('gems')}: ${saveData.gems}`,
            `${t('shards')}: ${saveData.shards}`
        ];

        const statTexts = stats.map((stat, i) => {
            return this.add.text(width / 2, height / 2 - 60 + i * 30, stat, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: CONFIG.COLORS.UI_TEXT
            }).setOrigin(0.5);
        });

        // Close button
        const closeBtn = this.add.text(width / 2, height / 2 + 100, t('close') || 'CLOSE', {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: CONFIG.COLORS.UI_ACCENT
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'));
        closeBtn.on('pointerout', () => closeBtn.setColor(CONFIG.COLORS.UI_ACCENT));
        closeBtn.on('pointerdown', () => {
            overlay.destroy();
            dialog.destroy();
            titleText.destroy();
            statTexts.forEach(t => t.destroy());
            closeBtn.destroy();
            this.statsDialog = false;
        });

        // Also close on overlay click
        overlay.on('pointerdown', () => {
            overlay.destroy();
            dialog.destroy();
            titleText.destroy();
            statTexts.forEach(t => t.destroy());
            closeBtn.destroy();
            this.statsDialog = false;
        });

        this.statsDialog = true;
    }
}
