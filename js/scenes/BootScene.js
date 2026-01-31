// BootScene - Initial loading and setup
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Show loading progress
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const t = (key) => localizationManager.t(key);

        // Loading bar background
        const bgBar = this.add.rectangle(width / 2, height / 2, 300, 30, 0x222222);

        // Loading bar fill
        const progressBar = this.add.rectangle(
            width / 2 - 145, height / 2,
            0, 22,
            CONFIG.COLORS.PADDLE
        ).setOrigin(0, 0.5);

        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, t('loading'), {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: CONFIG.COLORS.UI_TEXT
        }).setOrigin(0.5);

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.width = 290 * value;
        });

        this.load.on('complete', () => {
            loadingText.setText(t('ready'));
        });

        // Load audio assets
        this.load.audio('coin1', 'assets/audio/coin.mp3');
        this.load.audio('coin2', 'assets/audio/coin2.mp3');
        this.load.audio('coin3', 'assets/audio/coin3.mp3');
        this.load.audio('powerup', 'assets/audio/powerup.mp3');
        this.load.audio('gameover', 'assets/audio/gameover.mp3');
    }

    create() {
        // Initialize global game state
        this.game.saveData = saveManager.load();

        // Transition to menu
        this.time.delayedCall(500, () => {
            this.scene.start('MenuScene');
        });
    }
}
