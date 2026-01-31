// Main game configuration and initialization
const config = {
    type: Phaser.AUTO,
    width: CONFIG.GAME_WIDTH,
    height: CONFIG.GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: CONFIG.COLORS.BACKGROUND,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: CONFIG.GAME_WIDTH,
        height: CONFIG.GAME_HEIGHT
    },
    scene: [
        BootScene,
        MenuScene,
        GameScene,
        ShopScene,
        UpgradeScene,
        GameOverScene
    ]
};

// Start the game
const game = new Phaser.Game(config);

// Ensure canvas is centered after creation
window.addEventListener('resize', () => {
    if (game.scale) {
        game.scale.refresh();
    }
});

// Handle orientation changes on mobile
window.addEventListener('orientationchange', () => {
    // Wait for the orientation change to complete
    setTimeout(() => {
        if (game.scale) {
            game.scale.refresh();
        }
        // Force a resize event as well
        window.dispatchEvent(new Event('resize'));
    }, 200);
});

// Also use screen orientation API if available
if (screen.orientation) {
    screen.orientation.addEventListener('change', () => {
        setTimeout(() => {
            if (game.scale) {
                game.scale.refresh();
            }
        }, 200);
    });
}
