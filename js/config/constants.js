// Game Constants and Configuration
const CONFIG = {
    // Game dimensions (portrait orientation for mobile)
    GAME_WIDTH: 480,
    GAME_HEIGHT: 800,

    // Colors
    COLORS: {
        BACKGROUND: 0x1a1a2e,
        PADDLE: 0x4fc3f7,
        BALL: 0xffffff,
        UI_TEXT: '#ffffff',
        UI_ACCENT: '#4fc3f7',
        COIN: 0xffd700,
        GEM: 0xe040fb,
        SHARD: 0x00e5ff
    },

    // Paddle settings
    PADDLE: {
        WIDTH: 100,
        HEIGHT: 20,
        Y_OFFSET: 60,  // Distance from bottom
        SPEED: 800,
        COLOR: 0x4fc3f7
    },

    // Ball settings
    BALL: {
        RADIUS: 10,
        BASE_SPEED: 400,
        MAX_SPEED: 600,
        MIN_SPEED: 300,
        COLOR: 0xffffff
    },

    // Brick settings
    BRICK: {
        WIDTH: 52,
        HEIGHT: 24,
        PADDING: 4,
        OFFSET_TOP: 100,
        OFFSET_SIDE: 20,
        COLS: 8,
        ROWS: 6
    },

    // Brick types with their properties
    BRICK_TYPES: {
        NORMAL: { hp: 1, color: 0x26a69a, points: 10, coinDrop: 1 },
        TOUGH: { hp: 2, color: 0x5c6bc0, points: 25, coinDrop: 2 },
        TOUGH3: { hp: 3, color: 0x7e57c2, points: 40, coinDrop: 3 },
        EXPLOSIVE: { hp: 1, color: 0xef5350, points: 15, coinDrop: 1, explosive: true },
        GOLD: { hp: 1, color: 0xffd700, points: 50, coinDrop: 5 },
        MYSTERY: { hp: 1, color: 0xe040fb, points: 20, coinDrop: 1, dropsPowerUp: true },
        INDESTRUCTIBLE: { hp: Infinity, color: 0x424242, points: 0, coinDrop: 0 }
    },

    // Gameplay settings
    GAMEPLAY: {
        STARTING_LIVES: 3,
        STARTING_COINS: 0,
        COINS_PER_BRICK: 1,
        GEMS_PER_WAVE: 1,
        GEMS_PER_BOSS: 5,
        BOSS_WAVE_INTERVAL: 5
    },

    // Power-up types
    POWERUP_TYPES: {
        MULTIBALL: { name: 'Multi-Ball', color: 0x4fc3f7, duration: 0 },
        WIDE_PADDLE: { name: 'Wide Paddle', color: 0x66bb6a, duration: 15000 },
        FIREBALL: { name: 'Fireball', color: 0xef5350, duration: 10000 },
        SLOW: { name: 'Slow Motion', color: 0xffee58, duration: 10000 },
        SHIELD: { name: 'Shield', color: 0x42a5f5, duration: 0 },
        MAGNET: { name: 'Magnet', color: 0xab47bc, duration: 12000 }
    },

    // Shop prices (in coins)
    SHOP_PRICES: {
        MULTIBALL: 30,
        WIDE_PADDLE: 20,
        FIREBALL: 40,
        SLOW: 25,
        SHIELD: 35,
        MAGNET: 30
    },

    // Permanent upgrade costs (in gems)
    UPGRADE_COSTS: {
        STARTING_COINS: [5, 10, 15, 20, 30, 40, 50, 75, 100, 150],
        PADDLE_SIZE: [10, 25, 50, 100, 200],
        BALL_SPEED: [10, 25, 50, 100, 200],
        COIN_MULT: [5, 10, 20, 35, 50, 75, 100, 150, 200, 300],
        EXTRA_LIVES: [20, 75, 200],
        CRIT_CHANCE: [5, 10, 20, 35, 50, 75, 100, 150, 200, 300],
        SHOP_DISCOUNT: [15, 40, 80, 150, 300]
    }
};
