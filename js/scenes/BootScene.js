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

        // Load flag images
        this.load.image('flag-en', 'https://flagcdn.com/w40/gb.png');
        this.load.image('flag-es', 'https://flagcdn.com/w40/es.png');

        // Load sprite images
        this.load.image('ball-normal', 'assets/sprites/ball-normal.png');
        this.load.image('ball-fireball', 'assets/sprites/ball-fireball.png');
        this.load.image('paddle-standard', 'assets/sprites/paddle-standard.png');
        this.load.image('paddle-wide', 'assets/sprites/paddle-wide.png');

        // Load brick sprites
        this.load.image('brick-normal', 'assets/sprites/bricks/brick-normal.webp');
        this.load.image('brick-tough', 'assets/sprites/bricks/brick-tough.webp');
        this.load.image('brick-tough3', 'assets/sprites/bricks/brick-tough3.webp');
        this.load.image('brick-explosive', 'assets/sprites/bricks/brick-explosive.webp');
        this.load.image('brick-bomb-purple', 'assets/sprites/bricks/brick-bomb-purple.webp');
        this.load.image('brick-bomb-red', 'assets/sprites/bricks/brick-bomb-red.webp');
        this.load.image('brick-bomb-gold', 'assets/sprites/bricks/brick-bomb-gold.webp');
        this.load.image('brick-gold', 'assets/sprites/bricks/brick-gold.webp');
        this.load.image('brick-mystery', 'assets/sprites/bricks/brick-mystery.webp');
        this.load.image('brick-indestructible', 'assets/sprites/bricks/brick-indestructible.webp');

        // Load power-up sprites
        this.load.image('powerup-multiball', 'assets/sprites/powerups/powerup-multiball.webp');
        this.load.image('powerup-wide-paddle', 'assets/sprites/powerups/powerup-wide-paddle.webp');
        this.load.image('powerup-fireball', 'assets/sprites/powerups/powerup-fireball.webp');
        this.load.image('powerup-slow', 'assets/sprites/powerups/powerup-slow.webp');
        this.load.image('powerup-shield', 'assets/sprites/powerups/powerup-shield.webp');
        this.load.image('powerup-magnet', 'assets/sprites/powerups/powerup-magnet.webp');

        // Load background images
        this.load.image('bg-menu', 'assets/sprites/backgrounds/bg-menu.webp');
        this.load.image('bg-game', 'assets/sprites/backgrounds/bg-game.webp');
        this.load.image('bg-shop', 'assets/sprites/backgrounds/bg-shop.webp');
        this.load.image('bg-gameover', 'assets/sprites/backgrounds/bg-gameover.webp');
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
