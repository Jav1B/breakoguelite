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

        // Load sprite images (food theme)
        this.load.image('ball-normal', 'assets/sprites/food-game/ball-normal.png');
        this.load.image('ball-fireball', 'assets/sprites/food-game/ball-fireball.png');
        this.load.image('paddle-standard', 'assets/sprites/food-game/paddle-standard.png');
        this.load.image('paddle-wide', 'assets/sprites/food-game/paddle-wide.png');

        // Load brick sprites (food theme)
        this.load.image('brick-normal', 'assets/sprites/food-game/bricks/brick-normal.png');
        this.load.image('brick-tough', 'assets/sprites/food-game/bricks/brick-tough.png');
        this.load.image('brick-tough3', 'assets/sprites/food-game/bricks/brick-tough3.png');
        this.load.image('brick-explosive', 'assets/sprites/food-game/bricks/brick-explosive.png');
        this.load.image('brick-bomb-purple', 'assets/sprites/food-game/bricks/brick-bomb-purple.png');
        this.load.image('brick-bomb-red', 'assets/sprites/food-game/bricks/brick-bomb-red.png');
        this.load.image('brick-bomb-gold', 'assets/sprites/food-game/bricks/brick-bomb-gold.png');
        this.load.image('brick-gold', 'assets/sprites/food-game/bricks/brick-gold.png');
        this.load.image('brick-mystery', 'assets/sprites/food-game/bricks/brick-mystery.png');
        this.load.image('brick-indestructible', 'assets/sprites/food-game/bricks/brick-indestructible.png');

        // Load power-up sprites (food theme)
        this.load.image('powerup-multiball', 'assets/sprites/food-game/powerups/powerup-multiball.png');
        this.load.image('powerup-wide-paddle', 'assets/sprites/food-game/powerups/powerup-wide-paddle.png');
        this.load.image('powerup-fireball', 'assets/sprites/food-game/powerups/powerup-fireball.png');
        this.load.image('powerup-slow', 'assets/sprites/food-game/powerups/powerup-slow.png');
        this.load.image('powerup-shield', 'assets/sprites/food-game/powerups/powerup-shield.png');
        this.load.image('powerup-magnet', 'assets/sprites/food-game/powerups/powerup-magnet.png');

        // Load coin sprites (food theme)
        this.load.image('coin-1', 'assets/sprites/food-game/coins/coin-1.png');
        this.load.image('coin-2', 'assets/sprites/food-game/coins/coin-2.png');
        this.load.image('coin-3', 'assets/sprites/food-game/coins/coin-3.png');
        this.load.image('coin-5', 'assets/sprites/food-game/coins/coin-5.png');

        // Load background images
        this.load.image('bg-menu', 'assets/sprites/backgrounds/bg-menu.webp');
        this.load.image('bg-game', 'assets/sprites/backgrounds/bg-game.webp');
        this.load.image('bg-shop', 'assets/sprites/backgrounds/bg-shop.webp');
        this.load.image('bg-gameover', 'assets/sprites/backgrounds/bg-gameover.webp');

        // Load title logo
        this.load.image('title-logo', 'assets/sprites/title-logo.webp');
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
